const input = document.querySelector("#function-input");
const analyzeBtn = document.querySelector("#analyze-btn");
const functionPreview = document.querySelector("#function-preview");
const functionOutput = document.querySelector("#function-output");
const derivativeOutput = document.querySelector("#derivative-output");
const criticalOutput = document.querySelector("#critical-output");
const stepsOutput = document.querySelector("#steps-output");
const changeSummary = document.querySelector("#change-summary");
const canvas = document.querySelector("#graph");
const ctx = canvas.getContext("2d");

const problemSelect = document.querySelector("#problem-select");
const problemFields = document.querySelector("#problem-fields");
const solveProblemBtn = document.querySelector("#solve-problem-btn");
const problemResult = document.querySelector("#problem-result");

const questionText = document.querySelector("#question-text");
const answerOptions = document.querySelector("#answer-options");
const checkAnswerBtn = document.querySelector("#check-answer-btn");
const nextQuestionBtn = document.querySelector("#next-question-btn");
const feedback = document.querySelector("#feedback");
const scoreOutput = document.querySelector("#score");

let currentExpression = null;
let currentDerivative = null;
let currentCriticalPoints = [];
let currentQuestion = 0;
let correctAnswers = 0;
let answeredQuestions = 0;
let questionChecked = false;

const functions = new Set(["sin", "sen", "cos", "tan", "ln", "log", "sqrt", "exp", "abs"]);
const functionAliases = { sen: "sin", log: "ln" };
const constants = { pi: Math.PI, e: Math.E };

const practiceQuestions = [
  {
    text: "Si f(x)=x^2 - 6x + 5, ¿en qué valor de x hay un punto crítico?",
    options: ["x = 3", "x = -3", "x = 6"],
    correct: 0,
    feedback: "f'(x)=2x-6. Al igualar a cero se obtiene x=3."
  },
  {
    text: "La derivada f'(x) permite identificar:",
    options: ["Crecimiento, decrecimiento y puntos críticos", "Solo el valor inicial", "El color de la gráfica"],
    correct: 0,
    feedback: "La derivada muestra cómo cambia la función."
  },
  {
    text: "Si f''(x)>0 en un punto crítico, ese punto se clasifica como:",
    options: ["Máximo local", "Mínimo local", "No se puede evaluar"],
    correct: 1,
    feedback: "Cuando la segunda derivada es positiva, la gráfica es cóncava hacia arriba."
  }
];

const problemConfigs = {
  ganancia: {
    fields: [
      ["precioBase", "Precio base por unidad", 120],
      ["demandaBase", "Demanda inicial", 80],
      ["perdida", "Unidades que se pierden por cada aumento de $1", 2],
      ["costo", "Costo por unidad", 40]
    ],
    solve(values) {
      const a = values.precioBase;
      const b = values.demandaBase;
      const k = values.perdida;
      const c = values.costo;
      const optimalIncrease = (k * (a - c) - b) / (-2 * k);
      const price = a + optimalIncrease;
      const demand = b - k * optimalIncrease;
      const profit = (price - c) * demand;
      return {
        title: "Maximización de ganancias",
        lines: [
          `Ganancia: G(x)=(${a}+x-${c})(${b}-${k}x)`,
          `Derivada: G'(x)=${b - k * (a - c)} - ${2 * k}x`,
          `Punto crítico: x=${formatNumber(optimalIncrease)}`,
          `Precio recomendado: $${formatNumber(price)}`,
          `Demanda estimada: ${formatNumber(demand)} unidades`,
          `Ganancia máxima: $${formatNumber(profit)}`
        ]
      };
    }
  },
  costo: {
    fields: [
      ["fijo", "Costo fijo", 600],
      ["lineal", "Término lineal", -18],
      ["cuadratico", "Coeficiente cuadrático", 0.08]
    ],
    solve(values) {
      const x = -values.lineal / (2 * values.cuadratico);
      const usefulX = Math.max(0, x);
      const cost = values.fijo + values.lineal * usefulX + values.cuadratico * usefulX * usefulX;
      return {
        title: "Minimización de costos",
        lines: [
          `Costo: C(x)=${values.cuadratico}x^2 + ${values.lineal}x + ${values.fijo}`,
          `Derivada: C'(x)=${2 * values.cuadratico}x + ${values.lineal}`,
          `El vértice matemático está en x=${formatNumber(x)}`,
          `Con producción no negativa se toma x=${formatNumber(usefulX)}`,
          `Costo mínimo del modelo: $${formatNumber(cost)}`
        ]
      };
    }
  },
  area: {
    fields: [["perimetro", "Perímetro disponible", 40]],
    solve(values) {
      const side = values.perimetro / 4;
      const area = side * side;
      return {
        title: "Optimización de área",
        lines: [
          `Para un rectángulo con perímetro P, A(x)=x(P/2-x)`,
          `Con P=${values.perimetro}, A(x)=${values.perimetro / 2}x - x^2`,
          `Derivada: A'(x)=${values.perimetro / 2} - 2x`,
          `Punto crítico: x=${formatNumber(side)}`,
          `La figura de área máxima es un cuadrado de lado ${formatNumber(side)}`,
          `Área máxima: ${formatNumber(area)} unidades cuadradas`
        ]
      };
    }
  }
};

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .view").forEach((el) => el.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.view}`).classList.add("active");
    resizeGraph();
  });
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.example;
    analyze();
  });
});

document.querySelectorAll("[data-insert]").forEach((button) => {
  button.addEventListener("click", () => insertAtCursor(button.dataset.insert));
});

analyzeBtn.addEventListener("click", analyze);
input.addEventListener("input", updatePreview);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") analyze();
});

problemSelect.addEventListener("change", renderProblemFields);
solveProblemBtn.addEventListener("click", solveProblem);
checkAnswerBtn.addEventListener("click", checkPracticeAnswer);
nextQuestionBtn.addEventListener("click", nextPracticeQuestion);
window.addEventListener("resize", resizeGraph);

function tokenize(raw) {
  const source = raw.toLowerCase().replace(/π/g, "pi").replace(/÷/g, "/").replace(/\s+/g, "");
  if (!source) throw new Error("Ingresa una función para analizar.");
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    if (/[0-9.]/.test(char)) {
      let number = char;
      index += 1;
      while (index < source.length && /[0-9.]/.test(source[index])) {
        number += source[index];
        index += 1;
      }
      if (!Number.isFinite(Number(number))) throw new Error("Hay un número que no se puede leer.");
      tokens.push({ type: "number", value: Number(number), text: number });
      continue;
    }

    if (/[a-z]/.test(char)) {
      let name = char;
      index += 1;
      while (index < source.length && /[a-z]/.test(source[index])) {
        name += source[index];
        index += 1;
      }
      if (name !== "x" && !functions.has(name) && constants[name] === undefined) {
        throw new Error(`No reconozco "${name}". Usa x, pi, e, sin, cos, tan, ln, log, sqrt, exp o abs.`);
      }
      tokens.push({ type: functions.has(name) ? "function" : name === "x" ? "variable" : "constant", value: name });
      continue;
    }

    if ("+-*/^()".includes(char)) {
      tokens.push({ type: char, value: char });
      index += 1;
      continue;
    }

    throw new Error(`El símbolo "${char}" no es válido.`);
  }

  return addImplicitMultiplication(tokens);
}

function addImplicitMultiplication(tokens) {
  const result = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const current = tokens[i];
    const previous = result[result.length - 1];
    if (previous && shouldMultiply(previous, current)) result.push({ type: "*", value: "*" });
    result.push(current);
  }
  return result;
}

function shouldMultiply(left, right) {
  const leftValue = ["number", "variable", "constant", ")"].includes(left.type);
  const rightValue = ["number", "variable", "constant", "function", "("].includes(right.type);
  return leftValue && rightValue;
}

function parseExpression(raw) {
  const tokens = tokenize(raw);
  let position = 0;

  function peek() {
    return tokens[position];
  }

  function consume(type) {
    if (peek()?.type !== type) return null;
    position += 1;
    return tokens[position - 1];
  }

  function expression() {
    let node = term();
    while (peek() && ["+", "-"].includes(peek().type)) {
      const operator = consume(peek().type).type;
      node = binary(operator, node, term());
    }
    return node;
  }

  function term() {
    let node = factor();
    while (peek() && ["*", "/"].includes(peek().type)) {
      const operator = consume(peek().type).type;
      node = binary(operator, node, factor());
    }
    return node;
  }

  function factor() {
    if (consume("+")) return factor();
    if (consume("-")) return unary("-", factor());
    return power();
  }

  function power() {
    let node = primary();
    if (consume("^")) node = binary("^", node, factor());
    return node;
  }

  function primary() {
    const token = peek();
    if (!token) throw new Error("La función quedó incompleta.");
    if (consume("number")) return number(token.value);
    if (consume("variable")) return variable();
    if (consume("constant")) return constant(token.value);
    if (consume("function")) {
      if (!consume("(")) throw new Error(`Escribe ${token.value}(...) con paréntesis.`);
      const argument = expression();
      if (!consume(")")) throw new Error(`Falta cerrar el paréntesis de ${token.value}(...).`);
      return func(functionAliases[token.value] || token.value, argument);
    }
    if (consume("(")) {
      const node = expression();
      if (!consume(")")) throw new Error("Falta cerrar un paréntesis.");
      return node;
    }
    throw new Error("Revisa el orden de los símbolos en la función.");
  }

  const ast = simplify(expression());
  if (position < tokens.length) throw new Error("Hay símbolos al final que no pude interpretar.");
  return ast;
}

function number(value) {
  return { type: "number", value };
}

function variable() {
  return { type: "variable" };
}

function constant(name) {
  return { type: "constant", name };
}

function unary(operator, value) {
  return { type: "unary", operator, value };
}

function binary(operator, left, right) {
  return { type: "binary", operator, left, right };
}

function func(name, argument) {
  return { type: "function", name, argument };
}

function derivative(node) {
  switch (node.type) {
    case "number":
    case "constant":
      return number(0);
    case "variable":
      return number(1);
    case "unary":
      return unary("-", derivative(node.value));
    case "binary":
      return derivativeBinary(node);
    case "function":
      return derivativeFunction(node);
    default:
      return number(0);
  }
}

function derivativeBinary(node) {
  const u = node.left;
  const v = node.right;
  const du = derivative(u);
  const dv = derivative(v);
  if (node.operator === "+") return binary("+", du, dv);
  if (node.operator === "-") return binary("-", du, dv);
  if (node.operator === "*") return binary("+", binary("*", du, v), binary("*", u, dv));
  if (node.operator === "/") {
    return binary("/", binary("-", binary("*", du, v), binary("*", u, dv)), binary("^", v, number(2)));
  }
  if (node.operator === "^") {
    if (v.type === "number") {
      return binary("*", binary("*", number(v.value), binary("^", u, number(v.value - 1))), du);
    }
    return binary(
      "*",
      binary("^", u, v),
      binary("+", binary("*", dv, func("ln", u)), binary("*", v, binary("/", du, u)))
    );
  }
  return number(0);
}

function derivativeFunction(node) {
  const u = node.argument;
  const du = derivative(u);
  if (node.name === "sin") return binary("*", func("cos", u), du);
  if (node.name === "cos") return binary("*", unary("-", func("sin", u)), du);
  if (node.name === "tan") return binary("*", binary("/", number(1), binary("^", func("cos", u), number(2))), du);
  if (node.name === "ln") return binary("*", binary("/", number(1), u), du);
  if (node.name === "sqrt") return binary("*", binary("/", number(1), binary("*", number(2), func("sqrt", u))), du);
  if (node.name === "exp") return binary("*", func("exp", u), du);
  if (node.name === "abs") return binary("*", binary("/", u, func("abs", u)), du);
  return number(0);
}

function simplify(node) {
  if (!node) return node;
  if (node.type === "unary") {
    const value = simplify(node.value);
    if (isNumber(value)) return number(-value.value);
    return unary(node.operator, value);
  }
  if (node.type === "function") return func(node.name, simplify(node.argument));
  if (node.type !== "binary") return node;

  const left = simplify(node.left);
  const right = simplify(node.right);
  if (isNumber(left) && isNumber(right)) {
    const folded = applyOperator(node.operator, left.value, right.value);
    if (Number.isFinite(folded)) return number(folded);
  }
  if (node.operator === "+" && isZero(left)) return right;
  if (node.operator === "+" && isZero(right)) return left;
  if (node.operator === "-" && isZero(right)) return left;
  if (node.operator === "*" && (isZero(left) || isZero(right))) return number(0);
  if (node.operator === "*" && isOne(left)) return right;
  if (node.operator === "*" && isOne(right)) return left;
  if (node.operator === "/" && isZero(left)) return number(0);
  if (node.operator === "/" && isOne(right)) return left;
  if (node.operator === "^" && isZero(right)) return number(1);
  if (node.operator === "^" && isOne(right)) return left;
  return binary(node.operator, left, right);
}

function evaluate(node, x) {
  try {
    const value = evaluateNode(node, x);
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}

function evaluateNode(node, x) {
  if (node.type === "number") return node.value;
  if (node.type === "variable") return x;
  if (node.type === "constant") return constants[node.name];
  if (node.type === "unary") return -evaluateNode(node.value, x);
  if (node.type === "function") {
    const value = evaluateNode(node.argument, x);
    if (node.name === "sin") return Math.sin(value);
    if (node.name === "cos") return Math.cos(value);
    if (node.name === "tan") return Math.tan(value);
    if (node.name === "ln") return Math.log(value);
    if (node.name === "sqrt") return Math.sqrt(value);
    if (node.name === "exp") return Math.exp(value);
    if (node.name === "abs") return Math.abs(value);
  }
  const left = evaluateNode(node.left, x);
  const right = evaluateNode(node.right, x);
  return applyOperator(node.operator, left, right);
}

function applyOperator(operator, left, right) {
  if (operator === "+") return left + right;
  if (operator === "-") return left - right;
  if (operator === "*") return left * right;
  if (operator === "/") return left / right;
  if (operator === "^") return Math.pow(left, right);
  return NaN;
}

function toMath(node, parentPrecedence = 0) {
  if (node.type === "number") return formatNumber(node.value);
  if (node.type === "variable") return "x";
  if (node.type === "constant") return node.name === "pi" ? "π" : "e";
  if (node.type === "unary") return `-${toMath(node.value, 4)}`;
  if (node.type === "function") return `${node.name}(${toMath(node.argument)})`;

  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 }[node.operator];
  const left = toMath(node.left, precedence);
  const right = toMath(node.right, node.operator === "^" ? precedence : precedence + 0.1);
  let text = node.operator === "^" ? `${left}${superscript(right)}` : `${left} ${node.operator} ${right}`;
  if (node.operator === "*") text = `${left}·${right}`;
  if (precedence < parentPrecedence) text = `(${text})`;
  return text;
}

function superscript(value) {
  const map = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  return /^[\d-]+$/.test(value) ? value.split("").map((char) => map[char]).join("") : `^(${value})`;
}

function findCriticalPoints(expression, derivativeExpression) {
  const second = simplify(derivative(derivativeExpression));
  const points = [];
  let previousX = -12;
  let previousY = evaluate(derivativeExpression, previousX);

  for (let x = -11.95; x <= 12; x += 0.05) {
    const y = evaluate(derivativeExpression, x);
    if (Number.isFinite(y) && Math.abs(y) < 0.025) addUniquePoint(points, classifyPoint(expression, second, x));
    if (Number.isFinite(previousY) && Number.isFinite(y) && previousY * y < 0) {
      const root = bisectRoot(derivativeExpression, previousX, x);
      addUniquePoint(points, classifyPoint(expression, second, root));
    }
    previousX = x;
    previousY = y;
  }

  return points
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((a, b) => a.x - b.x);
}

function bisectRoot(expression, left, right) {
  let a = left;
  let b = right;
  for (let i = 0; i < 45; i += 1) {
    const mid = (a + b) / 2;
    const leftValue = evaluate(expression, a);
    const midValue = evaluate(expression, mid);
    if (!Number.isFinite(leftValue) || !Number.isFinite(midValue)) break;
    if (leftValue * midValue <= 0) b = mid;
    else a = mid;
  }
  return (a + b) / 2;
}

function classifyPoint(expression, second, x) {
  const secondValue = evaluate(second, x);
  let type = "punto estacionario";
  if (secondValue > 1e-4) type = "mínimo local";
  if (secondValue < -1e-4) type = "máximo local";
  return { x, y: evaluate(expression, x), type };
}

function addUniquePoint(points, point) {
  if (!points.some((existing) => Math.abs(existing.x - point.x) < 0.12)) points.push(point);
}

function analyze() {
  try {
    currentExpression = parseExpression(input.value);
    currentDerivative = simplify(derivative(currentExpression));
    currentCriticalPoints = findCriticalPoints(currentExpression, currentDerivative);

    functionPreview.textContent = `f(x) = ${toMath(currentExpression)}`;
    functionOutput.textContent = `f(x) = ${toMath(currentExpression)}`;
    derivativeOutput.textContent = `f'(x) = ${toMath(currentDerivative)}`;
    criticalOutput.textContent = currentCriticalPoints.length
      ? currentCriticalPoints.map((point) => `${formatNumber(point.x)} (${point.type})`).join(", ")
      : "No hay puntos críticos reales visibles";

    renderSteps(currentExpression, currentDerivative, currentCriticalPoints);
    drawGraph(currentExpression, currentDerivative, currentCriticalPoints);
  } catch (error) {
    currentExpression = null;
    currentDerivative = null;
    functionPreview.textContent = "Revisa la escritura";
    functionOutput.textContent = "Revisa la función";
    derivativeOutput.textContent = "-";
    criticalOutput.textContent = "-";
    changeSummary.innerHTML = "";
    stepsOutput.innerHTML = `<li class="warning">${escapeHtml(error.message)}</li>`;
    drawEmptyGraph(error.message);
  }
}

function updatePreview() {
  try {
    functionPreview.textContent = `f(x) = ${toMath(parseExpression(input.value))}`;
  } catch {
    functionPreview.textContent = "Escribe una función válida";
  }
}

function renderSteps(expression, derivativeExpression, points) {
  const readings = sampleDerivativeReading(derivativeExpression);
  const steps = [
    `Primero se lee la función como f(x) = ${toMath(expression)}.`,
    `La derivada queda f'(x) = ${toMath(derivativeExpression)}. Esta nueva función mide la pendiente: positiva significa que f sube, negativa significa que f baja y cercana a 0 significa que la gráfica se aplana.`,
    readings,
    "En la gráfica, la curva azul es la función original y la línea verde es su derivada. Mirarlas juntas permite ver cómo cambia una cuando la otra sube, baja o cruza el eje x."
  ];

  if (points.length) {
    steps.push(
      `Donde f'(x)=0 aparecen candidatos a cambio de dirección: ${points
        .map((point) => `x=${formatNumber(point.x)}, f(x)=${formatNumber(point.y)} (${point.type})`)
        .join("; ")}.`
    );
  } else {
    steps.push("En el rango visible no se encontró un valor donde f'(x)=0, así que no aparece un máximo o mínimo local claro.");
  }

  changeSummary.innerHTML = `
    <span class="result-label">Qué significa derivar aquí</span>
    <p>${escapeHtml(readings)}</p>
  `;
  stepsOutput.innerHTML = steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
}

function sampleDerivativeReading(derivativeExpression) {
  const xs = [-2, 0, 2, 4].map((x) => ({ x, slope: evaluate(derivativeExpression, x) })).filter((item) => Number.isFinite(item.slope));
  if (!xs.length) return "La derivada existe solo en partes del dominio visible; eso suele pasar con fracciones, raíces o logaritmos.";
  return xs
    .slice(0, 3)
    .map((item) => `en x=${formatNumber(item.x)}, f'(x)=${formatNumber(item.slope)}: la función ${item.slope > 0.05 ? "está subiendo" : item.slope < -0.05 ? "está bajando" : "está casi plana"}`)
    .join("; ") + ".";
}

function drawGraph(expression, derivativeExpression, criticalPoints) {
  resizeCanvas();
  const width = canvas.width;
  const height = canvas.height;
  const padding = 48;
  const xMin = -10;
  const xMax = 10;
  const fSamples = [];
  const dSamples = [];

  for (let px = 0; px <= width; px += 1) {
    const x = xMin + (px / width) * (xMax - xMin);
    fSamples.push({ x, y: evaluate(expression, x) });
    dSamples.push({ x, y: evaluate(derivativeExpression, x) });
  }

  const yValues = [...fSamples, ...dSamples]
    .map((sample) => sample.y)
    .filter((value) => Number.isFinite(value) && Math.abs(value) < 100000);
  criticalPoints.forEach((point) => yValues.push(point.y));

  let [yMin, yMax] = visibleRange(yValues);
  const toPx = (x) => padding + ((x - xMin) / (xMax - xMin)) * (width - padding * 2);
  const toPy = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - padding * 2);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  drawGrid(toPx, toPy, xMin, xMax, yMin, yMax, padding);
  drawCurve(fSamples, toPx, toPy, yMin, yMax, "#126b7f", 3);
  drawCurve(dSamples, toPx, toPy, yMin, yMax, "#237a4b", 2.5);
  drawLegend();

  criticalPoints.forEach((point) => {
    const x = toPx(point.x);
    const y = toPy(point.y);
    if (!Number.isFinite(x) || !Number.isFinite(y) || y < 0 || y > height) return;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = point.type.includes("máximo") ? "#95620f" : "#237a4b";
    ctx.fill();
    ctx.fillStyle = "#1e2933";
    ctx.font = "14px system-ui";
    ctx.fillText(`${point.type}: (${formatNumber(point.x)}, ${formatNumber(point.y)})`, x + 10, y - 10);
  });
}

function visibleRange(values) {
  if (!values.length) return [-5, 5];
  const sorted = values.slice().sort((a, b) => a - b);
  let yMin = sorted[Math.floor(sorted.length * 0.03)];
  let yMax = sorted[Math.ceil(sorted.length * 0.97) - 1];
  if (!Number.isFinite(yMin) || !Number.isFinite(yMax) || Math.abs(yMax - yMin) < 1) {
    yMin = -5;
    yMax = 5;
  }
  const margin = (yMax - yMin) * 0.14;
  return [yMin - margin, yMax + margin];
}

function drawCurve(samples, toPx, toPy, yMin, yMax, color, lineWidth) {
  ctx.beginPath();
  let drawing = false;
  samples.forEach((sample) => {
    const inView = Number.isFinite(sample.y) && sample.y >= yMin && sample.y <= yMax;
    if (!inView) {
      drawing = false;
      return;
    }
    const x = toPx(sample.x);
    const y = toPy(sample.y);
    if (!drawing) {
      ctx.moveTo(x, y);
      drawing = true;
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawLegend() {
  const items = [
    ["#126b7f", "f(x)"],
    ["#237a4b", "f'(x)"]
  ];
  ctx.font = "14px system-ui";
  items.forEach(([color, label], index) => {
    const x = 18 + index * 76;
    ctx.fillStyle = color;
    ctx.fillRect(x, 16, 18, 4);
    ctx.fillStyle = "#1e2933";
    ctx.fillText(label, x + 24, 22);
  });
}

function drawGrid(toPx, toPy, xMin, xMax, yMin, yMax, padding) {
  ctx.strokeStyle = "#e8edf4";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#637083";
  ctx.font = "12px system-ui";

  for (let x = xMin; x <= xMax; x += 2) {
    const px = toPx(x);
    ctx.beginPath();
    ctx.moveTo(px, padding / 2);
    ctx.lineTo(px, canvas.height - padding / 2);
    ctx.stroke();
    ctx.fillText(String(x), px - 6, canvas.height - 14);
  }

  const yStep = niceStep((yMax - yMin) / 6);
  const start = Math.ceil(yMin / yStep) * yStep;
  for (let y = start; y <= yMax; y += yStep) {
    const py = toPy(y);
    ctx.beginPath();
    ctx.moveTo(padding / 2, py);
    ctx.lineTo(canvas.width - padding / 2, py);
    ctx.stroke();
    ctx.fillText(formatNumber(y), 8, py - 4);
  }

  ctx.strokeStyle = "#8d98a8";
  ctx.lineWidth = 1.5;
  if (xMin <= 0 && xMax >= 0) {
    ctx.beginPath();
    ctx.moveTo(toPx(0), padding / 2);
    ctx.lineTo(toPx(0), canvas.height - padding / 2);
    ctx.stroke();
  }
  if (yMin <= 0 && yMax >= 0) {
    ctx.beginPath();
    ctx.moveTo(padding / 2, toPy(0));
    ctx.lineTo(canvas.width - padding / 2, toPy(0));
    ctx.stroke();
  }
}

function niceStep(value) {
  const power = Math.pow(10, Math.floor(Math.log10(Math.max(value, 0.001))));
  const normalized = value / power;
  if (normalized < 2) return power;
  if (normalized < 5) return 2 * power;
  return 5 * power;
}

function drawEmptyGraph(message) {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#bd3b3b";
  ctx.font = "18px system-ui";
  ctx.fillText(message, 28, 48);
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width));
  canvas.height = Math.max(220, Math.floor(rect.height));
}

function resizeGraph() {
  if (currentExpression && currentDerivative) drawGraph(currentExpression, currentDerivative, currentCriticalPoints);
}

function insertAtCursor(text) {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
  const nextPosition = start + text.length;
  input.focus();
  input.setSelectionRange(nextPosition, nextPosition);
  updatePreview();
}

function isNumber(node) {
  return node.type === "number" && Number.isFinite(node.value);
}

function isZero(node) {
  return isNumber(node) && Math.abs(node.value) < 1e-12;
}

function isOne(node) {
  return isNumber(node) && Math.abs(node.value - 1) < 1e-12;
}

function renderProblemFields() {
  const config = problemConfigs[problemSelect.value];
  problemFields.innerHTML = config.fields
    .map(
      ([id, label, value]) => `
        <div class="field-group">
          <label for="${id}">${label}</label>
          <input id="${id}" type="number" step="0.01" value="${value}">
        </div>
      `
    )
    .join("");
}

function solveProblem() {
  const config = problemConfigs[problemSelect.value];
  const values = {};
  config.fields.forEach(([id]) => {
    values[id] = Number(document.querySelector(`#${id}`).value);
  });

  if (Object.values(values).some((value) => !Number.isFinite(value))) {
    problemResult.innerHTML = `<p class="warning">Completa todos los datos con valores numéricos.</p>`;
    return;
  }

  const result = config.solve(values);
  problemResult.innerHTML = `
    <div class="summary">
      <h3>${result.title}</h3>
      ${result.lines.map((line) => `<div class="math-block">${line}</div>`).join("")}
      <p><span class="tag">Interpretación</span>El resultado sale de construir la función objetivo, derivarla, igualarla a cero y revisar si el valor obtenido tiene sentido en el contexto.</p>
    </div>
  `;
}

function renderPracticeQuestion() {
  const question = practiceQuestions[currentQuestion];
  questionText.textContent = question.text;
  answerOptions.innerHTML = question.options
    .map(
      (option, index) => `
        <label>
          <input type="radio" name="practice-answer" value="${index}">
          <span>${option}</span>
        </label>
      `
    )
    .join("");
  feedback.textContent = "";
  feedback.className = "feedback";
  questionChecked = false;
}

function checkPracticeAnswer() {
  if (questionChecked) return;

  const selected = document.querySelector("input[name='practice-answer']:checked");
  if (!selected) {
    feedback.textContent = "Selecciona una respuesta.";
    feedback.className = "feedback bad";
    return;
  }

  const question = practiceQuestions[currentQuestion];
  const isCorrect = Number(selected.value) === question.correct;
  answeredQuestions += 1;
  questionChecked = true;
  if (isCorrect) correctAnswers += 1;
  feedback.textContent = `${isCorrect ? "Correcto." : "Aún no."} ${question.feedback}`;
  feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
  scoreOutput.textContent = `${correctAnswers} / ${answeredQuestions}`;
}

function nextPracticeQuestion() {
  currentQuestion = (currentQuestion + 1) % practiceQuestions.length;
  renderPracticeQuestion();
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "-";
  const rounded = Math.abs(value) < 1e-9 ? 0 : value;
  return Number(rounded.toFixed(3)).toLocaleString("es-CO");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

renderProblemFields();
solveProblem();
renderPracticeQuestion();
analyze();
