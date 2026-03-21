export default function ProgressBar({ current, total }) {
  const pct = Math.min((current / total) * 100, 100);

  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span className="progress-label">PROGRESS</span>
        <span className="progress-fraction">
          {Math.min(current, total)} <span className="progress-of">of</span> {total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
        {/* Pip markers */}
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`progress-pip ${i < current ? "progress-pip--done" : ""}`}
            style={{ left: `${((i + 1) / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="progress-steps">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`progress-step ${i < current ? "progress-step--done" : ""} ${i === current - 1 ? "progress-step--current" : ""}`}
          >
            Q{i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
