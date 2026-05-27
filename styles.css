:root {
  color-scheme: light;
  --ink: #1e2933;
  --muted: #637083;
  --line: #d8dee8;
  --paper: #f7f9fc;
  --panel: #ffffff;
  --accent: #126b7f;
  --accent-strong: #0b5364;
  --accent-soft: #e4f4f7;
  --green: #237a4b;
  --red: #bd3b3b;
  --gold: #95620f;
  --shadow: 0 12px 30px rgba(33, 46, 63, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f5f7fb;
  color: var(--ink);
}

button,
input,
select {
  font: inherit;
}

button {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  min-height: 42px;
  border-radius: 7px;
  padding: 0 14px;
  cursor: pointer;
}

button:hover {
  border-color: var(--accent);
}

.app-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 22px;
  padding: 24px clamp(16px, 4vw, 48px) 18px;
  background: #fff;
  border-bottom: 1px solid var(--line);
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 0.95;
}

h2 {
  margin-bottom: 18px;
  font-size: 1.25rem;
}

h3 {
  margin-bottom: 10px;
  font-size: 1rem;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab {
  min-width: 118px;
}

.tab.active {
  color: #fff;
  border-color: var(--accent);
  background: var(--accent);
}

main {
  padding: 22px clamp(16px, 4vw, 48px) 42px;
}

.view {
  display: none;
}

.view.active {
  display: block;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(300px, 440px) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.two-column {
  grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
}

.panel {
  background: var(--panel);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.input-panel,
.results-panel,
.optimization-output,
.practice-card,
.score-panel {
  padding: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-weight: 700;
}

.input-row {
  display: flex;
  align-items: stretch;
  gap: 10px;
  border: 1px solid #b9dce3;
  border-radius: 8px;
  padding: 14px 22px;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(18, 107, 127, 0.04);
}

.input-row span {
  display: flex;
  align-items: center;
  color: var(--accent-strong);
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  font-weight: 700;
}

input,
select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 7px;
  min-height: 42px;
  padding: 0 12px;
  color: var(--ink);
  background: #fff;
}

.input-row input {
  border: 0;
  min-height: 42px;
  padding: 0;
  outline: none;
  background: transparent;
  font-size: 1.3rem;
}

.visual-input-row {
  min-height: 112px;
}

.equation-editor {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  min-height: 82px;
}

.equation-editor input {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 82px;
  color: transparent;
  caret-color: var(--ink);
  font-size: 1.28rem;
  line-height: 1.45;
}

.equation-editor input::selection {
  color: transparent;
  background: rgba(18, 107, 127, 0.18);
}

.equation-visual {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  overflow: visible;
  color: #143643;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.18rem, 2.5vw, 1.55rem);
  line-height: 1.25;
  pointer-events: none;
  white-space: nowrap;
}

.equation-visual .math-pretty {
  max-width: 100%;
  transform-origin: left center;
}

.examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(138px, 1fr));
  gap: 8px;
  margin: 10px 0 0;
}

.math-preview {
  margin-top: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  background: #fbfcfe;
}

.math-preview strong {
  display: block;
  overflow-wrap: anywhere;
  font-size: 1.05rem;
  line-height: 1.35;
}

.hidden-preview {
  display: none;
}

.math-pretty {
  display: inline-flex;
  align-items: center;
  gap: 0.18em;
  max-width: 100%;
  color: #143643;
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.25;
  vertical-align: middle;
}

.math-pretty sup {
  font-size: 0.68em;
  line-height: 1;
}

.math-pretty .frac {
  display: inline-grid;
  grid-template-rows: auto auto;
  min-width: 1.8em;
  text-align: center;
  vertical-align: middle;
  line-height: 1.08;
}

.math-pretty .num {
  padding: 0 0.2em 0.1em;
  border-bottom: 1.5px solid currentColor;
}

.math-pretty .den {
  padding: 0.12em 0.2em 0;
}

.math-pretty .radical {
  display: inline-flex;
  align-items: stretch;
}

.math-pretty .radicand {
  padding: 0 0.16em;
  border-top: 1.5px solid currentColor;
}

.math-pretty .paren {
  opacity: 0.82;
}

.math-pretty .op {
  margin: 0 0.12em;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.math-pretty .fn {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.86em;
  font-weight: 700;
}

.math-pretty .placeholder {
  color: #93a1b1;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.math-keyboard {
  display: grid;
  gap: 12px;
  margin-top: 14px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(33, 46, 63, 0.06);
}

.keyboard-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.keyboard-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border: 1px solid #dbe4ee;
  border-radius: 8px;
  background: #f6f8fb;
}

.keyboard-tabs button {
  min-height: 32px;
  min-width: 82px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  color: var(--muted);
  background: transparent;
  font-weight: 800;
}

.keyboard-tabs button.active {
  color: var(--accent-strong);
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(33, 46, 63, 0.08);
}

.keyboard-tabs button[data-keyboard-mode="basic"].active {
  color: #ffffff;
  background: var(--accent);
}

.keyboard-tabs button[data-keyboard-mode="advanced"].active {
  color: #ffffff;
  background: #5b55a0;
}

.keyboard-mode {
  display: grid;
  gap: 12px;
  padding: 10px;
  border: 1px solid #dbe7ee;
  border-radius: 8px;
  background: #f8fcfd;
}

.keyboard-mode[data-mode-panel="advanced"] {
  border-color: #d8d3ee;
  background: #faf9ff;
}

.keyboard-group {
  display: grid;
  gap: 8px;
}

.keyboard-group h3 {
  margin: 0;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.key-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(54px, 1fr));
  gap: 8px;
}

.numbers-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.number-pad {
  padding: 10px;
  border: 1px solid #e4e9f0;
  border-radius: 8px;
  background: #fbfcfe;
}

.math-keyboard .key {
  min-width: 0;
  min-height: 48px;
  padding: 6px 8px;
  border-radius: 8px;
  color: var(--ink);
  background: #ffffff;
  border-color: #dbe4ee;
  box-shadow: none;
  font-size: 1.05rem;
  font-weight: 800;
}

.math-keyboard .key:hover,
.keyboard-action:hover {
  transform: translateY(-1px);
}

.math-keyboard .number-key {
  color: #273344;
  background: #ffffff;
  border-color: #ccd6e2;
}

.math-keyboard .wide-key {
  grid-column: span 2;
}

.math-keyboard .expression-key {
  color: #0b5364;
  background: #f4fbfc;
}

.math-keyboard .operation-key {
  color: #5d3f07;
  background: #fffaf0;
  border-color: #f1dfb8;
}

.math-keyboard .function-key {
  color: #23552e;
  background: #f4fbf5;
  border-color: #b9dfc1;
}

.math-keyboard .advanced-key {
  color: #4b496f;
  background: #f7f6ff;
  border-color: #d4d0ee;
}

.keyboard-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.keyboard-action {
  min-width: 0;
  min-height: 44px;
  padding: 0 10px;
  border-radius: 8px;
  color: #20313a;
  background: #f9fbfd;
  border-color: #cfd8e3;
  font-weight: 800;
}

.keyboard-message {
  min-height: 20px;
  margin: -4px 0 0;
  color: var(--gold);
  font-size: 0.84rem;
  line-height: 1.35;
}

.examples button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 10px 12px;
  color: var(--accent-strong);
  background: var(--accent-soft);
  border-color: #b9dce3;
  overflow: visible;
}

.examples .math-pretty {
  justify-content: center;
  font-size: 1.02rem;
  text-align: center;
  white-space: nowrap;
}

.primary-action {
  width: 100%;
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 700;
}

.primary-action:hover {
  background: var(--accent-strong);
}

.hint {
  margin: 14px 0 0;
  color: var(--muted);
  line-height: 1.45;
}

.module-help {
  margin: -4px 0 14px;
  border-left: 4px solid var(--accent);
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--muted);
  background: #f6fbfc;
  line-height: 1.45;
}

.suggestion-title {
  margin-top: 16px;
  font-weight: 800;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.result-grid article,
.score-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 14px;
  background: #fbfcfe;
  min-width: 0;
}

.result-label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.result-grid strong,
.score-panel strong {
  display: block;
  overflow-wrap: anywhere;
  font-size: 1.05rem;
}

.graph-wrap {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  aspect-ratio: 16 / 9;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.explanation {
  margin-top: 16px;
  padding-top: 4px;
}

.change-summary {
  margin-top: 14px;
  border: 1px solid #cfe4e9;
  border-radius: 8px;
  padding: 14px;
  background: #f6fbfc;
}

.change-summary p {
  margin: 0;
  line-height: 1.55;
}

.explanation ol {
  margin: 0;
  padding-left: 22px;
  line-height: 1.55;
}

#problem-fields {
  display: grid;
  gap: 14px;
  margin: 16px 0;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-group small {
  color: var(--muted);
  line-height: 1.35;
}

.optimization-output {
  min-height: 360px;
}

.optimization-output .summary {
  display: grid;
  gap: 12px;
}

.optimization-intro {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.optimization-kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.optimization-kpis article,
.optimization-answer,
.optimization-steps {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  background: #fbfcfe;
}

.optimization-kpis strong {
  display: block;
  overflow-wrap: anywhere;
  line-height: 1.35;
}

.optimization-answer p {
  margin: 0 0 10px;
  line-height: 1.55;
}

.optimization-answer p:last-child {
  margin-bottom: 0;
}

.optimization-steps ol {
  margin: 0;
  padding-left: 20px;
  line-height: 1.55;
}

.math-block {
  border-left: 4px solid var(--accent);
  background: #f6fbfc;
  padding: 12px 14px;
  line-height: 1.55;
}

.practice-layout {
  display: grid;
  grid-template-columns: minmax(0, 680px) minmax(180px, 240px);
  gap: 18px;
  align-items: start;
}

.practice-card p {
  line-height: 1.55;
}

#question-select {
  margin-bottom: 16px;
}

.answer-options {
  display: grid;
  gap: 10px;
  margin: 18px 0;
}

.answer-options label {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 0;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
  font-weight: 500;
  cursor: pointer;
}

.answer-options input {
  width: auto;
  min-height: auto;
}

.practice-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.feedback {
  min-height: 28px;
  margin: 14px 0 0;
  font-weight: 700;
}

.feedback.good {
  color: var(--green);
}

.feedback.bad {
  color: var(--red);
}

.warning {
  color: var(--red);
  font-weight: 700;
}

.tag {
  display: inline-block;
  margin: 3px 6px 3px 0;
  padding: 5px 8px;
  border-radius: 6px;
  background: #edf6ee;
  color: var(--green);
  font-weight: 700;
}

@media (max-width: 900px) {
  .app-header,
  .workspace,
  .practice-layout {
    display: grid;
  }

  .workspace,
  .two-column,
  .practice-layout {
    grid-template-columns: 1fr;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }

  .optimization-kpis {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .app-header {
    padding-top: 18px;
  }

  .tabs,
  .tab {
    width: 100%;
  }

  main {
    padding-inline: 12px;
  }

  .input-panel,
  .results-panel,
  .optimization-output,
  .practice-card,
  .score-panel {
    padding: 16px;
  }

  .practice-actions {
    grid-template-columns: 1fr;
  }

  .keyboard-topline {
    align-items: stretch;
    flex-direction: column;
  }

  .keyboard-tabs {
    width: 100%;
  }

  .key-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .numbers-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .keyboard-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .key-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .visual-input-row {
    padding-inline: 14px;
  }

  .equation-visual {
    font-size: 1.08rem;
  }
}
