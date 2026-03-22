import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Zap, Brain, BarChart2, Building2,
  Mic, Code2, ArrowRight, CheckCircle2,
} from "lucide-react";
import Hero from "./Hero";

const TOPICS = [
  { id: "DSA",           label: "Data Structures & Algorithms", icon: "⬡", desc: "Arrays, trees, graphs, DP, complexity analysis",  tags: ["Sorting","Trees","DP","Graphs"],            difficulty: "Hard",   diffColor: "#ef4444" },
  { id: "System Design", label: "System Design",                icon: "◈", desc: "Scalability, databases, distributed systems",     tags: ["Scalability","Caching","Load Balancing"],   difficulty: "Medium", diffColor: "#f5a623" },
  { id: "HR",            label: "Behavioral / HR",              icon: "◉", desc: "STAR method, leadership, conflict resolution",    tags: ["Leadership","Teamwork","STAR"],             difficulty: "Easy",   diffColor: "#4ade80" },
];

const COMPANY_MODES = [
  { id: "Amazon",  icon: "▲", color: "#ff9900", desc: "Strict + Leadership Principles" },
  { id: "Google",  icon: "◆", color: "#4285f4", desc: "Deep conceptual + scalability"  },
  { id: "Startup", icon: "●", color: "#4ade80", desc: "Practical + execution focus"    },
  { id: "Generic", icon: "○", color: "#71717a", desc: "Balanced interview style"       },
];

const MODES = [
  { id: "chat",  label: "Chat Mode",  Icon: Code2, desc: "Type your answers",      badge: null   },
  { id: "voice", label: "Voice Mode", Icon: Mic,   desc: "Speak your answers",     badge: "BETA" },
  { id: "code",  label: "Code Mode",  Icon: Code2, desc: "Live coding challenges", badge: "BETA" },
];

const FEATURES = [
  { Icon: Zap,       title: "Real Interview Pressure",  desc: "Timed questions, aggressive follow-ups, and Socratic probing — exactly like a real interviewer would." },
  { Icon: Brain,     title: "Adaptive AI Logic",        desc: "Wrong? It probes harder. Partial? It nudges. Correct? It moves on. Zero hand-holding." },
  { Icon: BarChart2, title: "Live Evaluation",          desc: "Every answer scored Strong / Average / Weak with honest, direct feedback after each response." },
  { Icon: Building2, title: "Company-Specific Modes",   desc: "Amazon Leadership Principles, Google depth, or Startup pragmatism — tailored per company." },
  { Icon: Mic,       title: "Voice Interview Mode",     desc: "Speak your answers naturally. Real-time speech-to-text with the same AI evaluation." },
  { Icon: Code2,     title: "Live Code Editor",         desc: "Write, run, and submit solutions with a VS Code–style editor and runnable test cases." },
];

const STEPS = [
  { n: "01", title: "Configure your session",  desc: "Pick domain, company style, and interview mode. Set your difficulty level." },
  { n: "02", title: "Face the AI interviewer", desc: "It asks sharp questions, probes your reasoning, and never reveals the answer." },
  { n: "03", title: "Get your score",          desc: "See Strong / Average / Weak per question, plus an overall session summary." },
];

const TOTAL = 5;

function NavLink({ label, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 13, fontWeight: 500,
        color: hovered ? "rgba(228,224,216,0.92)" : "rgba(161,161,170,0.62)",
        textDecoration: "none",
        padding: "7px 14px", borderRadius: 50,
        background: hovered ? "rgba(255,255,255,0.05)" : "transparent",
        transition: "color 0.22s, background 0.22s",
        letterSpacing: "0.01em", whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {label}
    </motion.a>
  );
}

function FadeIn({ children, delay = 0, y = 32 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function LogoMark({ size = 34 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.29),
      background: "linear-gradient(135deg, #f5a623 0%, #e8940f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 0 14px rgba(245,166,35,0.3)",
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: Math.round(size * 0.38),
        fontWeight: 800,
        color: "#000",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        userSelect: "none",
      }}>
        ⚒️
      </span>
    </div>
  );
}

const S = {
  section:     { position: "relative", zIndex: 1, padding: "140px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  eyebrow:     { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.32em", color: "rgba(245,166,35,0.7)", marginBottom: 22, display: "block", textAlign: "center", textTransform: "uppercase" },
  sectionH:    { fontFamily: "var(--font-display)", fontSize: "clamp(32px,4.2vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.14, color: "var(--text)", textAlign: "center", margin: "0 auto 18px", maxWidth: 640 },
  sectionSub:  { fontFamily: "var(--font-display)", fontSize: "clamp(15px,1.8vw,17px)", color: "rgba(161,161,170,0.65)", lineHeight: 1.82, textAlign: "center", maxWidth: 480, margin: "0 auto 80px", letterSpacing: "0.01em" },
  configLabel: { fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(161,161,170,0.4)", letterSpacing: ".28em", marginBottom: 20, textTransform: "uppercase" },
};

export default function LandingScreen({ onStart }) {
  const [selected,  setSelected]  = useState("DSA");
  const [company,   setCompany]   = useState("Generic");
  const [mode,      setMode]      = useState("chat");
  const [launching, setLaunching] = useState(false);

  const topic        = TOPICS.find(t => t.id === selected);
  const companyColor = COMPANY_MODES.find(c => c.id === company)?.color || "#71717a";

  const go = () => {
    setLaunching(true);
    setTimeout(() => onStart(selected, TOTAL, company, mode), 800);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,166,35,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,0.028) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.28, 0.52, 0.28] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: "80vw", height: "80vw", maxWidth: 1000, maxHeight: 1000, borderRadius: "50%", top: "-35%", left: "50%", x: "-50%", background: "radial-gradient(circle,rgba(245,166,35,0.055) 0%,transparent 65%)", filter: "blur(72px)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ position: "sticky", top: 0, zIndex: 200, display: "flex", justifyContent: "center", padding: "14px 24px", background: "rgba(9,9,11,0.5)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 980, background: "rgba(17,17,20,0.86)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 50, padding: "10px 10px 10px 24px", backdropFilter: "blur(12px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.5), 0 0 0 4px rgba(9,9,11,0.8)" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={34} iconSize={16} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <span style={{ fontFamily: "'Syne', sans-serif",fontStyle: "italic" ,fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em", color: "#e4e0d8", lineHeight: 1 }}>PrepForge</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(245,166,35,0.65)", letterSpacing: "0.08em", border: "1px solid rgba(245,166,35,0.2)", padding: "1px 6px", borderRadius: 4 }}>v3.0</span>
            </div>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {[["Home","#"],["Features","#features"],["How it works","#how-it-works"],["Start","#start"]].map(([l, h]) => (
              <NavLink key={l} label={l} href={h} />
            ))}
          </nav>

          <motion.a href="#start"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#f5a623", color: "#000", fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, padding: "9px 20px", borderRadius: 50, textDecoration: "none", letterSpacing: "0.01em", boxShadow: "0 0 14px rgba(245,166,35,0.25)", whiteSpace: "nowrap", position: "relative", overflow: "hidden", transition: "box-shadow 0.25s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 26px rgba(245,166,35,0.46)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 14px rgba(245,166,35,0.25)"}
          >
            <motion.span animate={{ x: ["-120%", "220%"] }} transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}
              style={{ position: "absolute", top: 0, left: 0, width: "35%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)", pointerEvents: "none" }} />
            Start Interview →
          </motion.a>
        </div>
      </motion.div>

      <Hero
        onStart={() => document.getElementById("start")?.scrollIntoView({ behavior: "smooth" })}
        onHowItWorks={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
      />

      <section id="features" style={S.section}>
        <FadeIn>
          <span style={S.eyebrow}>Features</span>
          <h2 style={S.sectionH}>Built for real interview pressure</h2>
          <p style={S.sectionSub}>Not a chatbot. A rigorous AI interviewer engineered to expose exactly where your thinking breaks down.</p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 1060, margin: "0 auto" }}>
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(245,166,35,0.18)", boxShadow: "0 20px 48px rgba(0,0,0,0.4)" }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                style={{ background: "rgba(17,17,20,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "40px 32px", height: "100%", cursor: "default", backdropFilter: "blur(8px)" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(245,166,35,0.15)", background: "rgba(245,166,35,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                  <Icon size={19} strokeWidth={1.6} color="rgba(245,166,35,0.85)" />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "rgba(228,224,216,0.92)", marginBottom: 14, lineHeight: 1.28, letterSpacing: "-0.01em" }}>{title}</h3>
                <p  style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "rgba(161,161,170,0.62)", lineHeight: 1.8, letterSpacing: "0.008em" }}>{desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={S.section}>
        <FadeIn>
          <span style={S.eyebrow}>How it works</span>
          <h2 style={S.sectionH}>Three steps to interview-ready</h2>
          <p style={{ ...S.sectionSub, marginBottom: 80 }}>From zero to confident in one focused session.</p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", maxWidth: 880, margin: "0 auto" }}>
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1}>
              <div style={{ padding: "0 36px 0 0", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", marginRight: i < 2 ? 36 : 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,166,35,0.7)", letterSpacing: ".18em", marginBottom: 22 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "rgba(228,224,216,0.92)", marginBottom: 14, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{s.title}</h3>
                <p  style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "rgba(161,161,170,0.62)", lineHeight: 1.82, letterSpacing: "0.005em" }}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="start" style={S.section}>
        <FadeIn>
          <span style={S.eyebrow}>Configure your session</span>
          <h2 style={S.sectionH}>Set up your interview</h2>
          <p style={S.sectionSub}>Choose your domain, company style, and how you want to be tested.</p>
        </FadeIn>

        <div style={{ maxWidth: 880, margin: "0 auto" }}>

          <FadeIn delay={0.06}>
            <div style={{ marginBottom: 56 }}>
              <p style={S.configLabel}>01 — Select Domain</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {TOPICS.map(t => (
                  <motion.button key={t.id} onClick={() => setSelected(t.id)}
                    whileHover={{ y: -3 }} whileTap={{ scale: .98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    style={{ display: "flex", flexDirection: "column", gap: 12, padding: "26px 22px", borderRadius: 12, textAlign: "left", border: selected === t.id ? `1px solid ${t.diffColor}50` : "1px solid rgba(255,255,255,0.06)", background: selected === t.id ? `${t.diffColor}0c` : "rgba(17,17,20,0.5)", cursor: "pointer", position: "relative", outline: "none", transition: "border-color .2s, background .2s" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "rgba(245,166,35,0.8)" }}>{t.icon}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: t.diffColor, border: `1px solid ${t.diffColor}35`, background: `${t.diffColor}0d`, padding: "2px 9px", borderRadius: 20 }}>{t.difficulty}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "rgba(228,224,216,0.9)", lineHeight: 1.3 }}>{t.label}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "rgba(161,161,170,0.58)", lineHeight: 1.6 }}>{t.desc}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {t.tags.map(g => <span key={g} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(161,161,170,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>{g}</span>)}
                    </div>
                    {selected === t.id && (
                      <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", alignItems: "center", gap: 5 }}>
                        <CheckCircle2 size={12} color={t.diffColor} strokeWidth={2} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: t.diffColor, letterSpacing: ".1em" }}>SELECTED</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ marginBottom: 56 }}>
              <p style={S.configLabel}>02 — Company Mode</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {COMPANY_MODES.map(c => (
                  <motion.button key={c.id} onClick={() => setCompany(c.id)}
                    whileHover={{ y: -3 }} whileTap={{ scale: .98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    style={{ display: "flex", flexDirection: "column", gap: 10, padding: "22px 18px", borderRadius: 12, textAlign: "left", border: company === c.id ? `1px solid ${c.color}50` : "1px solid rgba(255,255,255,0.06)", background: company === c.id ? `${c.color}0c` : "rgba(17,17,20,0.5)", cursor: "pointer", outline: "none", transition: "border-color .2s, background .2s" }}
                  >
                    <span style={{ fontSize: 16, color: c.color, fontFamily: "var(--font-mono)" }}>{c.icon}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "rgba(228,224,216,0.9)" }}>{c.id}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "rgba(161,161,170,0.55)", lineHeight: 1.55 }}>{c.desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div style={{ marginBottom: 52 }}>
              <p style={S.configLabel}>03 — Interview Mode</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {MODES.map(({ id, label, Icon, desc, badge }) => (
                  <motion.button key={id} onClick={() => setMode(id)}
                    whileHover={{ y: -3 }} whileTap={{ scale: .98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    style={{ display: "flex", flexDirection: "column", gap: 10, padding: "22px 20px", borderRadius: 12, textAlign: "left", border: mode === id ? "1px solid rgba(245,166,35,.4)" : "1px solid rgba(255,255,255,0.06)", background: mode === id ? "rgba(245,166,35,0.05)" : "rgba(17,17,20,0.5)", cursor: "pointer", position: "relative", outline: "none", transition: "border-color .2s, background .2s" }}
                  >
                    {badge && <span style={{ position: "absolute", top: 12, right: 12, fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(245,166,35,0.7)", border: "1px solid rgba(245,166,35,.2)", background: "rgba(245,166,35,.05)", padding: "2px 7px", borderRadius: 20 }}>{badge}</span>}
                    <div style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid rgba(245,166,35,0.15)", background: "rgba(245,166,35,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={17} strokeWidth={1.6} color="rgba(245,166,35,0.8)" />
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "rgba(228,224,216,0.9)" }}>{label}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "rgba(161,161,170,0.55)" }}>{desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.18}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(17,17,20,0.5)", marginBottom: 32, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(161,161,170,0.4)", letterSpacing: ".2em", flexShrink: 0, textTransform: "uppercase" }}>Preview</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                {[`${topic.icon} ${topic.label}`, `${TOTAL} Questions`, `~${TOTAL * 3} min`].map((x, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "rgba(161,161,170,0.58)" }}>{x}</span>
                ))}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: topic.diffColor }}>{topic.difficulty}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: companyColor }}>{company} mode</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div style={{ textAlign: "center" }}>
              <motion.button
                onClick={go} disabled={launching}
                whileHover={!launching ? { scale: 1.04, y: -3 } : {}}
                whileTap={!launching ? { scale: .97 } : {}}
                style={{ display: "inline-flex", alignItems: "center", gap: 12, background: launching ? "rgba(245,166,35,.5)" : "var(--amber)", color: "#000", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, padding: "17px 54px", borderRadius: 4, border: "none", cursor: launching ? "not-allowed" : "pointer", boxShadow: "0 0 0 1px rgba(245,166,35,.25), 0 8px 32px rgba(245,166,35,.16)", letterSpacing: ".01em", marginBottom: 16, position: "relative", overflow: "hidden" }}
              >
                {!launching && (
                  <motion.span animate={{ x: ["-130%", "240%"] }} transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.5 }}
                    style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)", pointerEvents: "none" }} />
                )}
                {launching ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: .7, repeat: Infinity, ease: "linear" }}
                      style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(0,0,0,.25)", borderTopColor: "#000", borderRadius: "50%" }} />
                    Initializing...
                  </>
                ) : (
                  <>Start Interview <ArrowRight size={18} strokeWidth={2.2} /></>
                )}
              </motion.button>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(161,161,170,0.38)", letterSpacing: ".07em" }}>
                No spoon-feeding · Real pressure · Honest evaluation
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "36px 48px", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <LogoMark size={28} iconSize={12} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontStyle: "italic",fontSize: 16, fontWeight: 800, color: "var(--amber)", letterSpacing: "-0.02em" }}>PrepForge</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(245,166,35,0.55)", border: "1px solid rgba(245,166,35,0.18)", padding: "1px 6px", borderRadius: 4 }}>v3.0</span>
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif",fontStyle: "italic", fontSize: 12, color: "rgba(161,161,170,0.45)", fontStyle: "italic", letterSpacing: "0.02em" }}>
              Where Preparation Becomes Power.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {["Built with React + Vite", "Powered by OpenRouter", "MIT License"].map((t, i, a) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(161,161,170,0.38)" }}>{t}</span>
                {i < a.length - 1 && <span style={{ color: "rgba(161,161,170,0.25)", fontSize: 10 }}>·</span>}
              </span>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", overflow: "hidden", height: 30, display: "flex", alignItems: "center" }}>
          <motion.div animate={{ x: [0, "-50%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(161,161,170,0.28)", letterSpacing: ".18em" }}>
            {Array(14).fill("THINK · CODE · EXPLAIN · ITERATE · IMPROVE · ").map((t, i) => <span key={i}>{t}</span>)}
          </motion.div>
        </div>
      </footer>

    </div>
  );
}