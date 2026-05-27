const input = document.querySelector("#function-input");
const analyzeBtn = document.querySelector("#analyze-btn");
const functionPreview = document.querySelector("#function-preview");
const functionOutput = document.querySelector("#function-output");
const derivativeOutput = document.querySelector("#derivative-output");
const criticalOutput = document.querySelector("#critical-output");
const stepsOutput = document.querySelector("#steps-output");
const changeSummary = document.querySelector("#change-summary");
const functionVisual = document.querySelector("#function-visual");
const mathKeyboard = document.querySelector(".math-keyboard");
const keyboardMessage = document.querySelector("#keyboard-message");
const canvas = document.querySelector("#graph");
const ctx = canvas.getContext("2d");

const problemSelect = document.querySelector("#problem-select");
const problemPreset = document.querySelector("#problem-preset");
const problemHelp = document.querySelector("#problem-help");
const problemFields = document.querySelector("#problem-fields");
const solveProblemBtn = document.querySelector("#solve-problem-btn");
const problemResult = document.querySelector("#problem-result");

const questionText = document.querySelector("#question-text");
const questionSelect = document.querySelector("#question-select");
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

const functions = new Set(["sin", "sen", "cos", "tan", "ln", "log", "sqrt", "root", "exp", "abs"]);
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
  },
  {
    text: "¿Cuál es la derivada de f(x)=x^3?",
    options: ["3x^2", "x^2", "3x"],
    correct: 0,
    feedback: "La regla de potencia dice que la derivada de x^n es n*x^(n-1)."
  },
  {
    text: "¿Cuál es la derivada de f(x)=sin(x)?",
    options: ["cos(x)", "-sin(x)", "tan(x)"],
    correct: 0,
    feedback: "La derivada de sin(x) es cos(x)."
  },
  {
    text: "¿Cuál es la derivada de f(x)=cos(x)?",
    options: ["-sin(x)", "sin(x)", "1/cos(x)^2"],
    correct: 0,
    feedback: "La derivada de cos(x) es -sin(x)."
  },
  {
    text: "¿Cuál es la derivada de f(x)=ln(x)?",
    options: ["1/x", "x", "ln(x)/x"],
    correct: 0,
    feedback: "El logaritmo natural cambia con razón 1/x."
  },
  {
    text: "Si f(x)=x^2 - 4x, ¿dónde está el punto crítico?",
    options: ["x = 2", "x = -2", "x = 4"],
    correct: 0,
    feedback: "f'(x)=2x-4. Al igualar a cero queda x=2."
  },
  {
    text: "Para derivar f(x)=x*sin(x), ¿qué regla se usa?",
    options: ["Regla del producto", "Regla del cociente", "Solo regla de potencia"],
    correct: 0,
    feedback: "Hay dos factores: x y sin(x), por eso se usa la regla del producto."
  },
  {
    text: "Para derivar f(x)=(x^2+1)/(x-2), ¿qué regla conviene usar?",
    options: ["Regla del cociente", "Regla de la cadena", "Derivada constante"],
    correct: 0,
    feedback: "Es una división de funciones, así que se aplica la regla del cociente."
  },
  {
    text: "Si f'(x) cambia de positivo a negativo en un punto crítico, ese punto es:",
    options: ["Máximo local", "Mínimo local", "Asíntota vertical"],
    correct: 0,
    feedback: "La función sube antes del punto y baja después: eso forma un máximo local."
  },
  {
    text: "En optimización, después de construir la función objetivo, normalmente se debe:",
    options: ["Derivar e igualar a cero", "Cambiar x por pi", "Borrar la función"],
    correct: 0,
    feedback: "El valor óptimo suele aparecer donde la derivada vale cero o en un extremo del dominio."
  }
];

const problemConfigs = {
  ganancia: {
    description: "Modelo para decidir cuánto subir o bajar el precio cuando la demanda cambia. La variable x representa el cambio en el precio.",
    fields: [
      ["precioBase", "Precio base por unidad", 80, "Precio actual antes de modificarlo."],
      ["demandaBase", "Demanda inicial", 260, "Unidades vendidas con el precio base."],
      ["perdida", "Unidades que se pierden por cada aumento de $1", 4, "Pendiente de la demanda frente al precio."],
      ["costo", "Costo por unidad", 35, "Costo de producir o comprar cada unidad."]
    ],
    presets: [
      { label: "Tienda de camisetas", values: { precioBase: 80, demandaBase: 260, perdida: 4, costo: 35 } },
      { label: "Entradas a un evento", values: { precioBase: 45, demandaBase: 420, perdida: 6, costo: 12 } },
      { label: "Producto digital", values: { precioBase: 25, demandaBase: 900, perdida: 18, costo: 3 } }
    ],
    solve(values) {
      const a = values.precioBase;
      const b = values.demandaBase;
      const k = values.perdida;
      const c = values.costo;
      const optimalIncrease = (b - k * (a - c)) / (2 * k);
      const price = a + optimalIncrease;
      const demand = b - k * optimalIncrease;
      const profit = (price - c) * demand;
      return {
        title: "Maximización de ganancias",
        story: "Buscamos el cambio de precio que produce la mayor ganancia posible.",
        objective: "Maximizar la ganancia",
        variable: "x = cambio en el precio base",
        modelLabel: "G(x)",
        model: `(${a}+x-${c})*(${b}-${k}*x)`,
        derivativeLabel: "G'(x)",
        derivative: `${b - k * (a - c)} - ${2 * k}*x`,
        critical: `x=${formatNumber(optimalIncrease)}`,
        answer: `Precio recomendado: ${formatCurrency(price)}. Demanda estimada: ${formatNumber(demand)} unidades. Ganancia máxima: ${formatCurrency(profit)}.`,
        note: optimalIncrease >= 0 ? "Conviene aumentar el precio." : "El modelo sugiere bajar el precio base.",
        steps: [
          "Se escribe la ganancia como ingreso menos costo por unidad multiplicado por la demanda.",
          "Se deriva la función de ganancia para saber dónde deja de crecer.",
          "Se iguala la derivada a cero y se interpreta el valor de x en el contexto."
        ]
      };
    }
  },
  ingreso: {
    description: "Modelo para maximizar ingresos cuando solo interesa precio por cantidad vendida, sin incluir costos.",
    fields: [
      ["precioBase", "Precio base", 30, "Precio actual del producto o entrada."],
      ["demandaBase", "Demanda inicial", 180, "Cantidad vendida con el precio base."],
      ["perdida", "Unidades que se pierden por cada aumento de $1", 4, "Cuánto cae la demanda si sube el precio."]
    ],
    presets: [
      { label: "Boletas de cine", values: { precioBase: 30, demandaBase: 180, perdida: 4 } },
      { label: "Curso corto", values: { precioBase: 60, demandaBase: 300, perdida: 3 } },
      { label: "Suscripción mensual", values: { precioBase: 15, demandaBase: 600, perdida: 20 } }
    ],
    solve(values) {
      const p = values.precioBase;
      const d = values.demandaBase;
      const k = values.perdida;
      const x = (d - k * p) / (2 * k);
      const price = p + x;
      const demand = d - k * x;
      const revenue = price * demand;
      return {
        title: "Maximización de ingresos",
        story: "Buscamos el precio que hace mayor el dinero recibido por ventas.",
        objective: "Maximizar ingreso total",
        variable: "x = aumento del precio",
        modelLabel: "R(x)",
        model: `(${p}+x)*(${d}-${k}*x)`,
        derivativeLabel: "R'(x)",
        derivative: `${d - k * p} - ${2 * k}*x`,
        critical: `x=${formatNumber(x)}`,
        answer: `Precio óptimo: ${formatCurrency(price)}. Ventas estimadas: ${formatNumber(demand)} unidades. Ingreso máximo: ${formatCurrency(revenue)}.`,
        note: "Este modelo no descuenta costos; si hay costos, usa el ejemplo de ganancias.",
        steps: [
          "El ingreso es precio por cantidad.",
          "La demanda baja linealmente cuando el precio sube.",
          "La derivada indica el punto donde el ingreso deja de aumentar."
        ]
      };
    }
  },
  costo: {
    description: "Modelo cuadrático para encontrar la producción que minimiza el costo total.",
    fields: [
      ["fijo", "Costo fijo", 800, "Costo aunque no se produzca nada."],
      ["lineal", "Término lineal", -30, "Puede representar ahorro inicial o eficiencia por volumen."],
      ["cuadratico", "Coeficiente cuadrático", 0.15, "Debe ser positivo para que exista un mínimo."]
    ],
    presets: [
      { label: "Producción pequeña", values: { fijo: 800, lineal: -30, cuadratico: 0.15 } },
      { label: "Bodega", values: { fijo: 1200, lineal: -42, cuadratico: 0.21 } },
      { label: "Transporte", values: { fijo: 500, lineal: -16, cuadratico: 0.08 } }
    ],
    solve(values) {
      const x = -values.lineal / (2 * values.cuadratico);
      const usefulX = Math.max(0, x);
      const cost = values.fijo + values.lineal * usefulX + values.cuadratico * usefulX * usefulX;
      return {
        title: "Minimización de costos",
        story: "Buscamos la cantidad que hace menor el costo de operación.",
        objective: "Minimizar costo total",
        variable: "x = cantidad producida o nivel de operación",
        modelLabel: "C(x)",
        model: `${values.cuadratico}*x^2 + ${values.lineal}*x + ${values.fijo}`,
        derivativeLabel: "C'(x)",
        derivative: `${2 * values.cuadratico}*x + ${values.lineal}`,
        critical: `x=${formatNumber(x)}`,
        answer: `Cantidad recomendada: ${formatNumber(usefulX)}. Costo mínimo del modelo: ${formatCurrency(cost)}.`,
        note: x < 0 ? "El mínimo matemático era negativo, por eso se usa x=0 como cantidad posible." : "Como el coeficiente cuadrático es positivo, el punto crítico es un mínimo.",
        steps: [
          "La función de costo tiene forma de parábola.",
          "La derivada muestra en qué punto el costo deja de bajar.",
          "Si el punto crítico es posible en el contexto, se toma como cantidad recomendada."
        ]
      };
    }
  },
  area: {
    description: "Modelo clásico para maximizar el área de un rectángulo cuando el perímetro está fijo.",
    fields: [["perimetro", "Perímetro disponible", 48, "Longitud total disponible para rodear el rectángulo."]],
    presets: [
      { label: "Jardín rectangular", values: { perimetro: 48 } },
      { label: "Corral pequeño", values: { perimetro: 80 } },
      { label: "Marco de ventana", values: { perimetro: 24 } }
    ],
    solve(values) {
      const side = values.perimetro / 4;
      const area = side * side;
      return {
        title: "Optimización de área",
        story: "Buscamos las dimensiones del rectángulo de mayor área con perímetro fijo.",
        objective: "Maximizar área",
        variable: "x = uno de los lados del rectángulo",
        modelLabel: "A(x)",
        model: `x*(${values.perimetro / 2}-x)`,
        derivativeLabel: "A'(x)",
        derivative: `${values.perimetro / 2} - 2*x`,
        critical: `x=${formatNumber(side)}`,
        answer: `El área máxima se obtiene con un cuadrado de lado ${formatNumber(side)}. Área máxima: ${formatNumber(area)} unidades cuadradas.`,
        note: "Con perímetro fijo, el rectángulo de mayor área siempre es un cuadrado.",
        steps: [
          "Se expresa un lado en función del otro usando el perímetro.",
          "Se construye la función de área.",
          "Al derivar e igualar a cero aparece la dimensión óptima."
        ]
      };
    }
  },
  cerca: {
    description: "Modelo para maximizar el área cuando una pared reemplaza uno de los lados de la cerca.",
    fields: [["longitud", "Metros de cerca disponibles", 60, "La pared no consume cerca; solo se cercan tres lados."]],
    presets: [
      { label: "Huerta contra muro", values: { longitud: 60 } },
      { label: "Zona para mascotas", values: { longitud: 36 } },
      { label: "Cancha de práctica", values: { longitud: 120 } }
    ],
    solve(values) {
      const depth = values.longitud / 4;
      const front = values.longitud / 2;
      const area = depth * front;
      return {
        title: "Cerca contra una pared",
        story: "Buscamos el rectángulo de mayor área usando cerca solo en tres lados.",
        objective: "Maximizar área cercada",
        variable: "x = lado perpendicular a la pared",
        modelLabel: "A(x)",
        model: `x*(${values.longitud}-2*x)`,
        derivativeLabel: "A'(x)",
        derivative: `${values.longitud} - 4*x`,
        critical: `x=${formatNumber(depth)}`,
        answer: `Lados perpendiculares: ${formatNumber(depth)}. Lado frontal: ${formatNumber(front)}. Área máxima: ${formatNumber(area)} unidades cuadradas.`,
        note: "La pared funciona como el cuarto lado, por eso el modelo usa P-2x.",
        steps: [
          "Dos lados miden x, así que el frente mide la cerca restante.",
          "El área es profundidad por frente.",
          "La derivada determina el valor donde el área es máxima."
        ]
      };
    }
  },
  caja: {
    description: "Modelo para cortar cuadrados en las esquinas de una lámina y formar una caja abierta de volumen máximo.",
    fields: [
      ["largo", "Largo de la lámina", 30, "Medida mayor de la lámina."],
      ["ancho", "Ancho de la lámina", 20, "Medida menor de la lámina."]
    ],
    presets: [
      { label: "Cartón 30 x 20", values: { largo: 30, ancho: 20 } },
      { label: "Cartulina 40 x 25", values: { largo: 40, ancho: 25 } },
      { label: "Lámina 18 x 12", values: { largo: 18, ancho: 12 } }
    ],
    solve(values) {
      const l = values.largo;
      const w = values.ancho;
      const a = 12;
      const b = -4 * (l + w);
      const c = l * w;
      const discriminant = b * b - 4 * a * c;
      const roots = discriminant >= 0
        ? [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)]
        : [];
      const limit = Math.min(l, w) / 2;
      const cut = roots.find((root) => root > 0 && root < limit) || 0;
      const volume = cut * (l - 2 * cut) * (w - 2 * cut);
      return {
        title: "Caja abierta de volumen máximo",
        story: "Buscamos cuánto cortar en cada esquina para que la caja tenga el mayor volumen.",
        objective: "Maximizar volumen",
        variable: "x = lado del cuadrado que se corta en cada esquina",
        modelLabel: "V(x)",
        model: `x*(${l}-2*x)*(${w}-2*x)`,
        derivativeLabel: "V'(x)",
        derivative: `12*x^2 - ${4 * (l + w)}*x + ${l * w}`,
        critical: `x=${formatNumber(cut)}`,
        answer: `Corta cuadrados de lado ${formatNumber(cut)}. Volumen máximo aproximado: ${formatNumber(volume)} unidades cúbicas.`,
        note: `El corte debe estar entre 0 y ${formatNumber(limit)} para que la caja exista.`,
        steps: [
          "Al cortar x en cada esquina, el largo queda L-2x y el ancho queda W-2x.",
          "El volumen es alto por largo por ancho.",
          "Se deriva el volumen y se escoge el punto crítico que está dentro del dominio posible."
        ]
      };
    }
  },
  cilindro: {
    description: "Modelo para diseñar una lata cerrada con volumen fijo usando la menor cantidad de material.",
    fields: [["volumen", "Volumen requerido", 1000, "Volumen que debe contener la lata."]],
    presets: [
      { label: "Lata de 1000 unidades³", values: { volumen: 1000 } },
      { label: "Envase de 500 unidades³", values: { volumen: 500 } },
      { label: "Tanque de 2500 unidades³", values: { volumen: 2500 } }
    ],
    solve(values) {
      const v = values.volumen;
      const radius = Math.cbrt(v / (2 * Math.PI));
      const height = v / (Math.PI * radius * radius);
      const surface = 2 * Math.PI * radius * radius + 2 * Math.PI * radius * height;
      return {
        title: "Lata cilíndrica con mínimo material",
        story: "Buscamos radio y altura para mantener el volumen usando la menor superficie.",
        objective: "Minimizar superficie",
        variable: "r = radio de la base",
        modelLabel: "S(r)",
        modelText: `S(r)=2πr^2 + 2V/r, con V=${formatNumber(v)}`,
        derivativeText: `S'(r)=4πr - 2V/r^2`,
        critical: `r=${formatNumber(radius)}`,
        answer: `Radio recomendado: ${formatNumber(radius)}. Altura recomendada: ${formatNumber(height)}. Superficie mínima aproximada: ${formatNumber(surface)} unidades cuadradas.`,
        note: "En una lata cerrada óptima, la altura queda igual al diámetro.",
        steps: [
          "Se usa la fórmula del volumen para escribir la altura en función del radio.",
          "Se reemplaza esa altura en la superficie total.",
          "Al derivar la superficie aparece el radio que usa menos material."
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
  button.innerHTML = renderExpressionHtml(button.dataset.example);
  button.addEventListener("click", () => {
    input.value = button.dataset.example;
    analyze();
  });
});

mathKeyboard.addEventListener("click", handleKeyboardClick);
analyzeBtn.addEventListener("click", analyze);
input.addEventListener("input", () => {
  updateVisualInput();
  updatePreview();
});
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") analyze();
});

problemSelect.addEventListener("change", () => {
  renderProblemFields();
  solveProblem();
});
problemPreset.addEventListener("change", () => {
  applyProblemPreset();
  solveProblem();
});
solveProblemBtn.addEventListener("click", solveProblem);
questionSelect.addEventListener("change", () => {
  currentQuestion = Number(questionSelect.value);
  renderPracticeQuestion();
});
checkAnswerBtn.addEventListener("click", checkPracticeAnswer);
nextQuestionBtn.addEventListener("click", nextPracticeQuestion);
window.addEventListener("resize", resizeGraph);

function prepareExpression(raw) {
  const source = String(raw).trim().replace(/^f\s*\(\s*x\s*\)\s*=/i, "");
  if (/[=≤≥<>∫Σ∞]/.test(source) || /\blim\b|\bint\b|\bsum\b|\bf\s*\(|f'\s*\(/i.test(source)) {
    throw new Error("La notación de ecuaciones, desigualdades, límites, integrales y sumatorias es visual. Para analizar, escribe solo la expresión de f(x).");
  }
  return source;
}

function tokenize(raw) {
  const source = prepareExpression(raw)
    .toLowerCase()
    .replace(/π/g, "pi")
    .replace(/÷/g, "/")
    .replace(/·/g, "*")
    .replace(/\s+/g, "");
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
        throw new Error(`No reconozco "${name}". Usa x, pi, e, sin, cos, tan, ln, log, sqrt, root, exp o abs.`);
      }
      tokens.push({ type: functions.has(name) ? "function" : name === "x" ? "variable" : "constant", value: name });
      continue;
    }

    if ("+-*/^(),".includes(char)) {
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
      if (token.value === "root") {
        const degree = expression();
        if (!consume(",")) throw new Error("Escribe root(n, expresión), por ejemplo root(3, x+1).");
        const radicand = expression();
        if (!consume(")")) throw new Error("Falta cerrar el paréntesis de root(...).");
        return binary("^", radicand, binary("/", number(1), degree));
      }
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

function toMathHtml(node, parentPrecedence = 0) {
  if (node.type === "number") return escapeHtml(formatNumber(node.value));
  if (node.type === "variable") return "x";
  if (node.type === "constant") return node.name === "pi" ? "π" : "e";
  if (node.type === "unary") return `<span class="op">−</span>${toMathHtml(node.value, 4)}`;
  if (node.type === "function") {
    const argument = toMathHtml(node.argument);
    if (node.name === "sqrt") return `<span class="radical">√<span class="radicand">${argument}</span></span>`;
    if (node.name === "abs") return `|${argument}|`;
    if (node.name === "exp") return `e<sup>${argument}</sup>`;
    return `<span class="fn">${escapeHtml(node.name)}</span><span class="paren">(</span>${argument}<span class="paren">)</span>`;
  }

  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 }[node.operator];
  const rootParts = node.operator === "^" ? rootExponentParts(node.right) : null;
  if (rootParts) {
    const degree = toMathHtml(rootParts.degree);
    const radicand = toMathHtml(node.left);
    return `<span class="radical nth-root"><sup>${degree}</sup>√<span class="radicand">${radicand}</span></span>`;
  }

  const left = toMathHtml(node.left, precedence);
  const right = toMathHtml(node.right, node.operator === "^" ? precedence : precedence + 0.1);
  let html = "";
  if (node.operator === "^") html = `${left}<sup>${right}</sup>`;
  if (node.operator === "*") html = `${left}<span class="op">·</span>${right}`;
  if (node.operator === "/") {
    html = `<span class="frac"><span class="num">${left}</span><span class="den">${right}</span></span>`;
  }
  if (node.operator === "+") html = `${left}<span class="op">+</span>${right}`;
  if (node.operator === "-") html = `${left}<span class="op">−</span>${right}`;
  if (precedence < parentPrecedence) html = `<span class="paren">(</span>${html}<span class="paren">)</span>`;
  return html;
}

function rootExponentParts(node) {
  if (node?.type === "binary" && node.operator === "/" && isOne(node.left)) return { degree: node.right };
  if (isNumber(node) && node.value > 0) {
    const degree = 1 / node.value;
    if (Number.isInteger(Math.round(degree)) && Math.abs(degree - Math.round(degree)) < 1e-9 && degree >= 2 && degree <= 12) {
      return { degree: number(Math.round(degree)) };
    }
  }
  return null;
}

function mathLineHtml(label, node) {
  return `<span class="math-pretty"><span class="fn">${escapeHtml(label)}</span><span class="op">=</span>${toMathHtml(node)}</span>`;
}

function renderExpressionHtml(raw) {
  const source = String(raw).trim();
  if (!source) return `<span class="math-pretty"><span class="placeholder">Escribe una función</span></span>`;
  try {
    return `<span class="math-pretty">${toMathHtml(parseExpression(source))}</span>`;
  } catch {
    return `<span class="math-pretty">${formatRawMathHtml(source)}</span>`;
  }
}

function formatRawMathHtml(value) {
  let html = escapeHtml(value)
    .replace(/π/g, "π")
    .replace(/\bpi\b/gi, "π")
    .replace(/\*/g, "·")
    .replace(/\//g, "÷")
    .replace(/sqrt\s*\(/gi, "√(")
    .replace(/\broot\s*\(/gi, "√(")
    .replace(/\bexp\s*\(/gi, "e^(");

  html = html.replace(/(\)|x|e|π|\d)\^(-?\d+(?:[.,]\d+)?)/g, "$1<sup>$2</sup>");
  html = html.replace(/\^/g, '<span class="op">^</span>');
  return html;
}

function renderMathText(value) {
  return escapeHtml(value)
    .replace(/\bpi\b/gi, "π")
    .replace(/\*/g, "·")
    .replace(/([a-zA-Z])\^(-?\d+(?:[.,]\d+)?)/g, "$1<sup>$2</sup>")
    .replace(/\)\^(-?\d+(?:[.,]\d+)?)/g, ")<sup>$1</sup>")
    .replace(/f'\(x\)/g, "<span class=\"math-pretty\"><span class=\"fn\">f'(x)</span></span>")
    .replace(/f\(x\)/g, '<span class="math-pretty"><span class="fn">f(x)</span></span>')
    .replace(/([A-Z])'\(x\)/g, '<span class="math-pretty"><span class="fn">$1&apos;(x)</span></span>')
    .replace(/([A-Z])\(x\)/g, '<span class="math-pretty"><span class="fn">$1(x)</span></span>');
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
  updateVisualInput();
  try {
    currentExpression = parseExpression(input.value);
    currentDerivative = simplify(derivative(currentExpression));
    currentCriticalPoints = findCriticalPoints(currentExpression, currentDerivative);

    functionPreview.innerHTML = mathLineHtml("f(x)", currentExpression);
    functionOutput.innerHTML = mathLineHtml("f(x)", currentExpression);
    derivativeOutput.innerHTML = mathLineHtml("f'(x)", currentDerivative);
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
  updateVisualInput();
  try {
    functionPreview.innerHTML = mathLineHtml("f(x)", parseExpression(input.value));
  } catch {
    functionPreview.textContent = "Escribe una función válida";
  }
}

function renderSteps(expression, derivativeExpression, points) {
  const readings = sampleDerivativeReading(derivativeExpression);
  const steps = [
    `Primero se lee la función como ${mathLineHtml("f(x)", expression)}.`,
    `La derivada queda ${mathLineHtml("f'(x)", derivativeExpression)}. Esta nueva función mide la pendiente: positiva significa que f sube, negativa significa que f baja y cercana a 0 significa que la gráfica se aplana.`,
    renderMathText(readings),
    "En la gráfica, la curva azul es la función original y la línea verde es su derivada. Mirarlas juntas permite ver cómo cambia una cuando la otra sube, baja o cruza el eje x."
  ];

  if (points.length) {
    steps.push(
      `Donde ${renderMathText("f'(x)=0")} aparecen candidatos a cambio de dirección: ${points
        .map((point) => `x=${formatNumber(point.x)}, ${renderMathText("f(x)")}=${formatNumber(point.y)} (${point.type})`)
        .join("; ")}.`
    );
  } else {
    steps.push("En el rango visible no se encontró un valor donde f'(x)=0, así que no aparece un máximo o mínimo local claro.");
  }

  changeSummary.innerHTML = `
    <span class="result-label">Qué significa derivar aquí</span>
    <p>${renderMathText(readings)}</p>
  `;
  stepsOutput.innerHTML = steps.map((step) => `<li>${step}</li>`).join("");
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

function updateVisualInput() {
  if (!functionVisual) return;
  functionVisual.innerHTML = renderExpressionHtml(input.value);
}

// Gestiona modos, acciones y símbolos desde un solo panel de teclado.
function handleKeyboardClick(event) {
  const button = event.target.closest("button");
  if (!button || !mathKeyboard.contains(button)) return;

  if (button.dataset.keyboardMode) {
    setKeyboardMode(button.dataset.keyboardMode);
    return;
  }

  const action = button.dataset.action;
  if (action === "unsupported") {
    showKeyboardMessage("Este símbolo está disponible visualmente, pero aún no está implementado en el analizador.");
    input.focus();
    return;
  }

  if (action === "differentiate") {
    analyze();
    showKeyboardMessage("Derivada calculada en el panel de resultados.");
    return;
  }

  if (action === "nth-root") {
    insertAtCursor("root(,)", { nthRoot: true });
    return;
  }

  if (action === "visual-insert") {
    insertAtCursor(button.dataset.insert || "");
    showKeyboardMessage("Notación añadida. Para analizar, deja en el campo solo una expresión de f(x).");
    return;
  }

  if (action === "backspace") {
    deleteLastSymbol();
    return;
  }

  if (action === "clear") {
    clearFunction();
    return;
  }

  if (action === "power") {
    insertAtCursor(button.dataset.insert, { power: button.dataset.power });
    return;
  }

  if (button.dataset.wrap) {
    insertAtCursor(`${button.dataset.wrap}()`, { wrap: button.dataset.wrap });
    return;
  }

  if (button.dataset.insert !== undefined) {
    insertAtCursor(button.dataset.insert);
    if (/[=≤≥,]/.test(button.dataset.insert)) {
      showKeyboardMessage("Ese símbolo ya se puede escribir visualmente; el analizador usa solo expresiones de una función.");
    }
  }
}

function setKeyboardMode(mode) {
  document.querySelectorAll("[data-keyboard-mode]").forEach((button) => {
    const isActive = button.dataset.keyboardMode === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll("[data-mode-panel]").forEach((panel) => {
    const isActive = panel.dataset.modePanel === mode;
    panel.hidden = !isActive;
    panel.classList.toggle("active", isActive);
  });

  showKeyboardMessage("");
}

// Inserta símbolos, envuelve selecciones y coloca el cursor dentro de funciones.
function insertAtCursor(text, options = {}) {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const selectedText = input.value.slice(start, end);
  const wrapper = options.wrap || getFunctionWrapper(text);

  let insertion = text;
  let nextPosition = start + text.length;

  if (options.power) {
    insertion = selectedText ? `(${selectedText})^${options.power}` : `^${options.power}`;
    nextPosition = start + insertion.length;
  } else if (options.nthRoot) {
    insertion = selectedText ? `root(2,${selectedText})` : "root(,)";
    nextPosition = selectedText ? start + insertion.length : start + "root(".length;
  } else if (wrapper) {
    insertion = `${wrapper}(${selectedText})`;
    nextPosition = selectedText ? start + insertion.length : start + wrapper.length + 1;
  }

  replaceInputRange(start, end, insertion, nextPosition);
}

function getFunctionWrapper(text) {
  const functionText = text.match(/^([a-z]+)\(\)?$/i) || text.match(/^([a-z]+)\($/i);
  return functionText ? functionText[1].toLowerCase() : "";
}

function replaceInputRange(start, end, text, nextPosition) {
  input.value = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
  input.focus();
  input.setSelectionRange(nextPosition, nextPosition);
  updatePreview();
  showKeyboardMessage("");
}

function deleteLastSymbol() {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  if (start !== end) {
    replaceInputRange(start, end, "", start);
    return;
  }
  if (start > 0) replaceInputRange(start - 1, start, "", start - 1);
  else input.focus();
}

function clearFunction() {
  input.value = "";
  input.focus();
  updatePreview();
  showKeyboardMessage("");
}

function showKeyboardMessage(message) {
  if (keyboardMessage) keyboardMessage.textContent = message;
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
  if (problemHelp) problemHelp.textContent = config.description;
  problemPreset.innerHTML = config.presets
    .map((preset, index) => `<option value="${index}">${escapeHtml(preset.label)}</option>`)
    .join("");
  problemFields.innerHTML = config.fields
    .map(
      ([id, label, value, help]) => `
        <div class="field-group">
          <label for="${id}">${label}</label>
          <input id="${id}" type="number" step="0.01" value="${value}">
          ${help ? `<small>${escapeHtml(help)}</small>` : ""}
        </div>
      `
    )
    .join("");
  applyProblemPreset();
}

function applyProblemPreset() {
  const config = problemConfigs[problemSelect.value];
  const preset = config.presets[Number(problemPreset.value)] || config.presets[0];
  if (!preset) return;
  Object.entries(preset.values).forEach(([id, value]) => {
    const field = document.querySelector(`#${id}`);
    if (field) field.value = value;
  });
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
  problemResult.innerHTML = renderOptimizationResult(result);
}

function renderOptimizationResult(result) {
  return `
    <div class="summary optimization-summary">
      <h3>${escapeHtml(result.title)}</h3>
      <p class="optimization-intro">${escapeHtml(result.story)}</p>
      <div class="optimization-kpis">
        <article>
          <span class="result-label">Objetivo</span>
          <strong>${escapeHtml(result.objective)}</strong>
        </article>
        <article>
          <span class="result-label">Variable</span>
          <strong>${escapeHtml(result.variable)}</strong>
        </article>
        <article>
          <span class="result-label">Punto crítico</span>
          <strong>${renderMathText(result.critical)}</strong>
        </article>
      </div>
      <div class="math-block">
        <span class="result-label">Modelo</span>
        ${result.modelText ? renderMathText(result.modelText) : renderFormula(result.modelLabel, result.model)}
      </div>
      <div class="math-block">
        <span class="result-label">Derivada</span>
        ${result.derivativeText ? renderMathText(result.derivativeText) : renderFormula(result.derivativeLabel, result.derivative)}
      </div>
      <div class="optimization-answer">
        <span class="result-label">Respuesta</span>
        <p>${escapeHtml(result.answer)}</p>
        <p><span class="tag">Interpretación</span>${escapeHtml(result.note)}</p>
      </div>
      <div class="optimization-steps">
        <span class="result-label">Cómo se resolvió</span>
        <ol>${result.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      </div>
    </div>
  `;
}

function renderFormula(label, expression) {
  try {
    return mathLineHtml(label, parseExpression(expression));
  } catch {
    return renderMathText(`${label}=${expression}`);
  }
}

function renderPracticeQuestion() {
  const question = practiceQuestions[currentQuestion];
  if (questionSelect) questionSelect.value = String(currentQuestion);
  questionText.innerHTML = renderMathText(question.text);
  answerOptions.innerHTML = question.options
    .map(
      (option, index) => `
        <label>
          <input type="radio" name="practice-answer" value="${index}">
          <span>${renderMathText(option)}</span>
        </label>
      `
    )
    .join("");
  feedback.innerHTML = "";
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
  feedback.innerHTML = renderMathText(`${isCorrect ? "Correcto." : "Aún no."} ${question.feedback}`);
  feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
  scoreOutput.textContent = `${correctAnswers} / ${answeredQuestions}`;
}

function nextPracticeQuestion() {
  currentQuestion = (currentQuestion + 1) % practiceQuestions.length;
  renderPracticeQuestion();
}

function renderPracticeSelector() {
  questionSelect.innerHTML = practiceQuestions
    .map((question, index) => `<option value="${index}">${index + 1}. ${escapeHtml(question.text.replace(/<[^>]*>/g, ""))}</option>`)
    .join("");
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "-";
  const rounded = Math.abs(value) < 1e-9 ? 0 : value;
  return Number(rounded.toFixed(3)).toLocaleString("es-CO");
}

function formatCurrency(value) {
  return `$${formatNumber(value)}`;
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
renderPracticeSelector();
renderPracticeQuestion();
analyze();
