import { useState, useEffect } from "react";

const TOPICS = [
  {
    id: "DSA",
    label: "Data Structures & Algorithms",
    icon: "⬡",
    desc: "Arrays, trees, graphs, DP, complexity analysis",
    tags: ["Sorting", "Trees", "Dynamic Programming", "Graphs"],
    difficulty: "Hard",
    diffColor: "#ef4444",
  },
  {
    id: "System Design",
    label: "System Design",
    icon: "◈",
    desc: "Scalability, databases, distributed systems",
    tags: ["Scalability", "Caching", "Load Balancing", "Databases"],
    difficulty: "Medium",
    diffColor: "#f5a623",
  },
  {
    id: "HR",
    label: "Behavioral / HR",
    icon: "◉",
    desc: "STAR method, leadership, conflict resolution",
    tags: ["Leadership", "Conflict", "Teamwork", "STAR"],
    difficulty: "Easy",
    diffColor: "#4ade80",
  },
];

const TOTAL_QUESTIONS = 5;

export default function LandingScreen({ onStart }) {
  const [selected, setSelected] = useState("DSA");
  const [mounted, setMounted] = useState(false);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    setLaunching(true);
    setTimeout(() => onStart(selected, TOTAL_QUESTIONS), 700);
  };

  const selectedTopic = TOPICS.find((t) => t.id === selected);

  return (
    <div className={`landing ${mounted ? "landing--mounted" : ""}`}>
      <div className="noise-overlay" />
      <div className="grid-lines" />
      <div className="landing-glow" />

      <header className="landing-header">
        <div className="logo-group">
          <span className="logo-mark">IC_BOT</span>
          <span className="logo-version">v3.0</span>
        </div>
        <span className="status-pill">
          <span className="status-dot" />
          SYSTEM ONLINE
        </span>
      </header>

      <main className="landing-main">
        <div className="eyebrow land-anim land-anim-1">
          <span className="eyebrow-line" />
          AI INTERVIEW SIMULATOR 
          <span className="eyebrow-line" />
        </div>

        <h1 className="hero-title land-anim land-anim-2">
          Crack Your<br />
          <span className="hero-accent">Next Interview</span>
        </h1>

        <p className="hero-sub land-anim land-anim-3">
          An AI interviewer that <em>pushes you to think</em> — asks follow-ups,<br />
          withholds answers, and evaluates your reasoning in real time.
        </p>

        <div className="stats-row land-anim land-anim-4">
          {[
            ["5", "QUESTIONS", "per session"],
            ["3", "DOMAINS", "to practice"],
            ["Live", "EVALUATION", "after each answer"],
          ].map(([val, lbl, sub]) => (
            <div key={lbl} className="stat-item">
              <span className="stat-val">{val}</span>
              <span className="stat-lbl">{lbl}</span>
              <span className="stat-sub">{sub}</span>
            </div>
          ))}
        </div>

        <div className="topic-section land-anim land-anim-5">
          <p className="section-label">SELECT DOMAIN</p>
          <div className="topic-grid">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                className={`topic-card ${selected === t.id ? "topic-card--active" : ""}`}
                onClick={() => setSelected(t.id)}
              >
                <div className="topic-card-top">
                  <span className="topic-icon">{t.icon}</span>
                  <span className="topic-difficulty" style={{ color: t.diffColor, borderColor: t.diffColor + "44", backgroundColor: t.diffColor + "11" }}>
                    {t.difficulty}
                  </span>
                </div>
                <span className="topic-name">{t.label}</span>
                <span className="topic-desc">{t.desc}</span>
                <div className="topic-tags">
                  {t.tags.map((tag) => (
                    <span key={tag} className="topic-tag">{tag}</span>
                  ))}
                </div>
                {selected === t.id && <span className="topic-check">✓ SELECTED</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Session preview bar */}
        <div className="session-preview land-anim land-anim-5">
          <span className="session-preview-label">SESSION PREVIEW</span>
          <div className="session-preview-details">
            <span className="preview-item">
              {selectedTopic.icon} {selectedTopic.label}
            </span>
            <span className="preview-sep">·</span>
            <span className="preview-item">{TOTAL_QUESTIONS} Questions</span>
            <span className="preview-sep">·</span>
            <span className="preview-item">~{TOTAL_QUESTIONS * 3} min estimated</span>
            <span className="preview-sep">·</span>
            <span className="preview-item" style={{ color: selectedTopic.diffColor }}>
              {selectedTopic.difficulty} Difficulty
            </span>
          </div>
        </div>

        <button
          className={`cta-btn land-anim land-anim-6 ${launching ? "cta-btn--launching" : ""}`}
          onClick={handleStart}
          disabled={launching}
        >
          {launching ? (
            <>
              <span className="cta-spinner" />
              <span>Initializing Session...</span>
            </>
          ) : (
            <>
              <span className="cta-text">Start Interview</span>
              <span className="cta-arrow">→</span>
            </>
          )}
        </button>

        <p className="cta-note land-anim land-anim-6">
          No spoon-feeding · Real pressure · Honest evaluation
        </p>
      </main>

      <footer className="landing-footer">
        <div className="ticker">
          {Array(8).fill("THINK · CODE · EXPLAIN · ITERATE · IMPROVE · ").map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
