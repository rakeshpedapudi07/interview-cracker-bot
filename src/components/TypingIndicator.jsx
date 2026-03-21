export default function TypingIndicator({ state = "thinking" }) {
  const labels = {
    thinking: "Evaluating your answer",
    waiting: "Interviewer is waiting…",
    loading: "Preparing next question",
  };

  return (
    <div className="message-row message-row--bot">
      <div className="msg-avatar msg-avatar--bot">AI</div>
      <div className="message-bubble bubble--bot bubble--typing">
        <span className="typing-label">{labels[state] || labels.thinking}</span>
        <span className="typing-dots">
          <span /><span /><span />
        </span>
      </div>
    </div>
  );
}
