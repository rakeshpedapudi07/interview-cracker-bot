import { useState, useRef } from "react";

const TEMPLATES = {
  DSA: `// Write your solution here
function solution(input) {
  // Your code
  
}

// Test it:
console.log(solution());`,
  "System Design": `// Pseudo-code your system design
// Components:

// Data flow:

// Scale considerations:`,
  HR: `// Structure your answer using STAR:
// Situation:
// Task:
// Action:
// Result:`,
};

export default function CodeEditor({ topic, onSubmit, disabled }) {
  const [code, setCode] = useState(TEMPLATES[topic] || TEMPLATES["DSA"]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textareaRef.current.selectionStart = start + 2;
        textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  const runCode = () => {
    setRunning(true);
    setOutput("");
    try {
      const logs = [];
      const fakeConsole = { log: (...args) => logs.push(args.join(" ")) };
      const fn = new Function("console", code);
      fn(fakeConsole);
      setOutput(logs.join("\n") || "✓ Code ran (no output)");
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = () => {
    if (!code.trim() || disabled) return;
    onSubmit(`Here is my code solution:\n\`\`\`\n${code}\n\`\`\``);
  };

  return (
    <div className="code-editor-wrap">
      <div className="code-editor-header">
        <div className="code-editor-tabs">
          <span className="code-tab code-tab--active">solution.js</span>
        </div>
        <div className="code-editor-actions">
          <button className="code-run-btn" onClick={runCode} disabled={running}>
            {running ? "Running..." : "▶ Run"}
          </button>
          <button className="code-submit-btn" onClick={handleSubmit} disabled={disabled}>
            Submit →
          </button>
        </div>
      </div>

      <div className="code-editor-body">
        {/* Line numbers */}
        <div className="code-line-nums">
          {code.split("\n").map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          disabled={disabled}
        />
      </div>

      {output && (
        <div className="code-output">
          <span className="code-output-label">OUTPUT</span>
          <pre className="code-output-text">{output}</pre>
        </div>
      )}
    </div>
  );
}