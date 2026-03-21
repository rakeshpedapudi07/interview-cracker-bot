import { useState, useEffect, useRef } from "react";

export default function QuestionTimer({ active, questionNum, warningAfter = 90 }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  // Reset timer on new question
  useEffect(() => {
    setElapsed(0);
  }, [questionNum]);

  useEffect(() => {
    if (!active) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active, questionNum]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const isWarning = elapsed >= warningAfter;
  const isCritical = elapsed >= warningAfter * 1.5;

  return (
    <div className={`timer-display ${isWarning ? "timer--warn" : ""} ${isCritical ? "timer--critical" : ""}`}>
      <span className="timer-icon">{isCritical ? "⚠" : "◷"}</span>
      <span className="timer-value">{display}</span>
      {isWarning && !isCritical && (
        <span className="timer-hint">Take your time, but think fast</span>
      )}
      {isCritical && (
        <span className="timer-hint timer-hint--critical">Interviewer is waiting…</span>
      )}
    </div>
  );
}
