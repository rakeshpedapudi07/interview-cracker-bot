const GRADE_ORDER = ["Strong", "Good", "Average", "Weak"];

function scoreSession(evaluations) {
  if (!evaluations.length) return { label: "Incomplete", color: "#666", pct: 0 };
  const pts = { Strong: 3, Good: 3, Average: 2, Weak: 1 };
  const max = evaluations.length * 3;
  const earned = evaluations.reduce((s, e) => s + (pts[e.grade] || 2), 0);
  const pct = Math.round((earned / max) * 100);
  if (pct >= 80) return { label: "Excellent", color: "#4ade80", pct };
  if (pct >= 60) return { label: "Good", color: "#f5a623", pct };
  if (pct >= 40) return { label: "Average", color: "#f97316", pct };
  return { label: "Needs Work", color: "#ef4444", pct };
}

export default function SessionSummary({ evaluations, topic, totalQuestions, onRetry, onExit }) {
  const score = scoreSession(evaluations);
  const counts = { Strong: 0, Good: 0, Average: 0, Weak: 0 };
  evaluations.forEach((e) => { if (counts[e.grade] !== undefined) counts[e.grade]++; });

  return (
    <div className="summary-overlay">
      <div className="summary-box">
        <div className="summary-header">
          <span className="summary-logo">IC_BOT</span>
          <span className="summary-tag">SESSION COMPLETE</span>
        </div>

        {/* Score ring */}
        <div className="score-ring-wrap">
          <svg className="score-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={score.color} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - score.pct / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1.2s ease" }}
            />
          </svg>
          <div className="score-inner">
            <span className="score-pct">{score.pct}%</span>
            <span className="score-label" style={{ color: score.color }}>{score.label}</span>
          </div>
        </div>

        <p className="summary-topic">{topic} Interview · {totalQuestions} Questions</p>

        {/* Grade breakdown */}
        <div className="grade-breakdown">
          {[
            { key: "Strong",  color: "#4ade80", icon: "▲" },
            { key: "Good",    color: "#4ade80", icon: "▲" },
            { key: "Average", color: "#f5a623", icon: "◆" },
            { key: "Weak",    color: "#ef4444", icon: "▼" },
          ]
            .filter((g) => counts[g.key] > 0)
            .map((g) => (
              <div key={g.key} className="grade-row">
                <span className="grade-icon" style={{ color: g.color }}>{g.icon}</span>
                <span className="grade-key">{g.key}</span>
                <div className="grade-bar-track">
                  <div
                    className="grade-bar-fill"
                    style={{
                      width: `${(counts[g.key] / totalQuestions) * 100}%`,
                      background: g.color,
                    }}
                  />
                </div>
                <span className="grade-count" style={{ color: g.color }}>{counts[g.key]}</span>
              </div>
            ))}
        </div>

        {/* Per-question feedback */}
        {evaluations.length > 0 && (
          <div className="feedback-list">
            <p className="feedback-list-title">QUESTION FEEDBACK</p>
            {evaluations.map((e, i) => (
              <div key={i} className="feedback-item">
                <span className="feedback-qnum">Q{i + 1}</span>
                <p className="feedback-text">{e.feedback}</p>
              </div>
            ))}
          </div>
        )}

        <div className="summary-actions">
          <button className="summary-btn summary-btn--secondary" onClick={onExit}>
            ← Back to Home
          </button>
          <button className="summary-btn summary-btn--primary" onClick={onRetry}>
            Retry Session →
          </button>
        </div>
      </div>
    </div>
  );
}
