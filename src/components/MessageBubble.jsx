const EVAL_CONFIG = {
  Strong:  { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", icon: "▲" },
  Good:    { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", icon: "▲" },
  Average: { color: "#f5a623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.25)", icon: "◆" },
  Weak:    { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)",  icon: "▼" },
};

export default function MessageBubble({ message, displayText, isTyping }) {
  const isUser = message.role === "user";
  const eval_ = message.evaluation;
  const evalCfg = eval_ ? (EVAL_CONFIG[eval_.grade] || EVAL_CONFIG["Average"]) : null;
  const text = displayText ?? message.content;

  const formatText = (t) => {
    const parts = (t || "").split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );
  };

  return (
    <div className={`message-row ${isUser ? "message-row--user" : "message-row--bot"}`}>
      {!isUser && <div className="msg-avatar msg-avatar--bot">AI</div>}

      <div className="message-col">
        {message.questionNum && !isUser && (
          <span className="q-badge">Q{message.questionNum}</span>
        )}

        <div className={`message-bubble ${isUser ? "bubble--user" : "bubble--bot"} ${message.isHint ? "bubble--hint" : ""} ${message.isSolution ? "bubble--solution" : ""}`}>
          {message.isHint && <div className="bubble-type-label bubble-type-label--hint">💡 HINT</div>}
          {message.isSolution && <div className="bubble-type-label bubble-type-label--solution">🔓 FULL SOLUTION</div>}

          <p className="bubble-text">
            {formatText(text)}
            {isTyping && <span className="bubble-cursor" />}
          </p>

          <span className="bubble-time">
            {new Date(message.id || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {eval_ && (
          <div className="eval-card" style={{ borderColor: evalCfg.border, background: evalCfg.bg }}>
            <div className="eval-top">
              <span className="eval-grade" style={{ color: evalCfg.color }}>{evalCfg.icon} {eval_.grade}</span>
              <span className="eval-label">EVALUATION</span>
            </div>
            <p className="eval-feedback">{eval_.feedback}</p>
          </div>
        )}
      </div>

      {isUser && <div className="msg-avatar msg-avatar--user">YOU</div>}
    </div>
  );
}