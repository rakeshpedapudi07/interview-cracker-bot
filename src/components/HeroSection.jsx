import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Animated counter for stats
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(start);
    }, 24);
    return () => clearInterval(timer);
  }, [to]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

// Floating particle
function Particle({ x, y, size, duration, delay }) {
  return (
    <motion.div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: size, height: size, borderRadius: "50%",
        background: "rgba(245,166,35,0.15)",
        filter: "blur(1px)",
      }}
      animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.3, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const PARTICLES = [
  { x: 10, y: 20, size: 4, duration: 4, delay: 0 },
  { x: 85, y: 15, size: 6, duration: 5, delay: 0.5 },
  { x: 25, y: 70, size: 3, duration: 3.5, delay: 1 },
  { x: 75, y: 65, size: 5, duration: 4.5, delay: 0.3 },
  { x: 50, y: 85, size: 4, duration: 3, delay: 0.8 },
  { x: 92, y: 50, size: 3, duration: 5.5, delay: 1.2 },
  { x: 5,  y: 50, size: 5, duration: 4,   delay: 0.6 },
  { x: 60, y: 10, size: 3, duration: 3.8, delay: 0.2 },
];

// Typewriter for the rotating words
const ROLES = ["Technical Interview", "DSA Round", "System Design", "Behavioral Round", "Google Interview", "Amazon Loop"];

function TypewriterWord() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = ROLES[index];
    let timeout;
    if (!deleting && text.length < word.length) {
      timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index]);

  return (
    <span style={{ color: "var(--amber)", position: "relative" }}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ display: "inline-block", width: 3, height: "0.9em", background: "var(--amber)", marginLeft: 3, verticalAlign: "middle" }}
      />
    </span>
  );
}

// Animated grid background
function AnimatedGrid() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Static grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* Radial gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 70%)",
      }} />
      {/* Moving spotlight */}
      <motion.div
        style={{
          position: "absolute", width: 600, height: 600,
          borderRadius: "50%", top: "-100px", left: "50%", x: "-50%",
          background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Horizontal scan line */}
      <motion.div
        style={{
          position: "absolute", left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.3), transparent)",
        }}
        animate={{ top: ["-5%", "110%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      />
    </div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function HeroSection({ onStart, onDemo }) {
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const rotateX = useTransform(mouseY, [-300, 300], [2, -2]);
  const rotateY = useTransform(mouseX, [-300, 300], [-2, 2]);

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 24px", overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <AnimatedGrid />

      {/* Particles */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Badge */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show"
        transition={{ delay: 0.1 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 20,
          border: "1px solid rgba(245,166,35,0.3)",
          background: "rgba(245,166,35,0.07)",
          marginBottom: 32,
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)", display: "inline-block" }}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,166,35,0.9)", letterSpacing: "0.2em" }}>
          AI INTERVIEW SIMULATOR · v3.0
        </span>
      </motion.div>

      {/* Main headline */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ textAlign: "center", maxWidth: 820, marginBottom: 24 }}
      >
        <motion.div variants={fadeUp}>
          <span style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 7.5vw, 100px)",
            fontWeight: 800, lineHeight: 0.92,
            letterSpacing: "-0.04em",
            color: "rgba(232,228,220,0.45)",
            marginBottom: 4,
          }}>
            Stop Practicing.
          </span>
        </motion.div>

        <motion.div variants={fadeUp}>
          <span style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 7.5vw, 100px)",
            fontWeight: 800, lineHeight: 0.95,
            letterSpacing: "-0.04em",
            background: "linear-gradient(135deg, #f5a623 0%, #ffd070 40%, #f5a623 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(245,166,35,0.35))",
          }}>
            Start Performing.
          </span>
        </motion.div>
      </motion.div>

      {/* Typewriter line */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show"
        transition={{ delay: 0.4 }}
        style={{
          fontFamily: "var(--font-mono)", fontSize: "clamp(13px, 2vw, 16px)",
          color: "var(--text-muted)", marginBottom: 20, textAlign: "center",
          letterSpacing: "0.02em",
        }}
      >
        Practice your <TypewriterWord /> with AI
      </motion.div>

      {/* Subtext */}
      <motion.p
        variants={fadeIn} initial="hidden" animate="show"
        transition={{ delay: 0.55 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(15px, 2vw, 18px)",
          color: "var(--text-dim)", lineHeight: 1.7,
          maxWidth: 520, textAlign: "center", marginBottom: 48,
        }}
      >
        An AI interviewer that{" "}
        <em style={{ fontStyle: "italic", color: "var(--text)" }}>pushes you to think</em>
        {" "}— asks follow-ups, withholds answers, evaluates your reasoning, and tells you the truth.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show"
        transition={{ delay: 0.65 }}
        style={{ display: "flex", gap: 14, marginBottom: 64, flexWrap: "wrap", justifyContent: "center" }}
      >
        {/* Primary */}
        <motion.button
          onHoverStart={() => setHoverPrimary(true)}
          onHoverEnd={() => setHoverPrimary(false)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--amber)", color: "#000",
            fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700,
            padding: "14px 36px", borderRadius: 4, border: "none",
            cursor: "pointer", letterSpacing: "0.02em",
            boxShadow: hoverPrimary
              ? "0 0 0 1px rgba(245,166,35,0.5), 0 8px 32px rgba(245,166,35,0.4)"
              : "0 0 0 1px rgba(245,166,35,0.2), 0 4px 16px rgba(245,166,35,0.2)",
            transition: "box-shadow 0.3s ease",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Shimmer */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
            style={{
              position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              pointerEvents: "none",
            }}
          />
          Start Interview
          <motion.span
            animate={{ x: hoverPrimary ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ display: "inline-block", fontSize: 18 }}
          >
            →
          </motion.span>
        </motion.button>

        {/* Secondary */}
        <motion.button
          onHoverStart={() => setHoverSecondary(true)}
          onHoverEnd={() => setHoverSecondary(false)}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDemo}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "transparent", color: "var(--text-dim)",
            fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 500,
            padding: "14px 32px", borderRadius: 4,
            border: hoverSecondary ? "1px solid rgba(245,166,35,0.4)" : "1px solid var(--border-strong)",
            cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
            color: hoverSecondary ? "var(--text)" : "var(--text-dim)",
          }}
        >
          <span style={{ fontSize: 14 }}>▶</span>
          Watch Demo
        </motion.button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeIn} initial="hidden" animate="show"
        transition={{ delay: 0.8 }}
        style={{
          display: "flex", gap: 0,
          border: "1px solid var(--border)",
          borderRadius: 8, overflow: "hidden",
          background: "var(--bg-2)",
        }}
      >
        {[
          { val: 10000, suffix: "+", label: "Interviews" },
          { val: 94, suffix: "%", label: "Improved" },
          { val: 3, suffix: "", label: "Domains" },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: "16px 32px", textAlign: "center",
            borderRight: i < 2 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>
              <Counter to={s.val} suffix={s.suffix} />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.15em", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.2em", textAlign: "center" }}
        >
          SCROLL ↓
        </motion.div>
      </motion.div>
    </section>
  );
}