import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const ROLES = [
  "Technical Interview",
  "DSA Round",
  "System Design",
  "Behavioral Round",
  "Google Loop",
  "Amazon Interview",
];

function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = ROLES[idx];
    let t;
    if (!del && txt.length < word.length)
      t = setTimeout(() => setTxt(word.slice(0, txt.length + 1)), 68);
    else if (!del && txt.length === word.length)
      t = setTimeout(() => setDel(true), 2400);
    else if (del && txt.length > 0)
      t = setTimeout(() => setTxt(txt.slice(0, -1)), 30);
    else { setDel(false); setIdx(i => (i + 1) % ROLES.length); }
    return () => clearTimeout(t);
  }, [txt, del, idx]);

  return (
    <span style={{ color: "#f5a623" }}>
      {txt}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "inline-block", width: 2, height: "0.78em", background: "#f5a623", marginLeft: 3, verticalAlign: "middle" }}
      />
    </span>
  );
}

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(to / 50);
      const id = setInterval(() => {
        start = Math.min(start + step, to);
        setVal(start);
        if (start >= to) clearInterval(id);
      }, 20);
    }, { threshold: 0.5 });
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function GridBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          "linear-gradient(rgba(245,166,35,0.035) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(245,166,35,0.035) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "64px 64px",
      }} />
      <motion.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.25, 0.48, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", borderRadius: "50%",
          width: "72vw", height: "72vw", maxWidth: 960, maxHeight: 960,
          top: "-30%", left: "50%", x: "-50%",
          background: "radial-gradient(circle, rgba(245,166,35,0.065) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", borderRadius: "50%",
          width: "60vw", height: "30vw", bottom: "-10%", left: "50%", x: "-50%",
          background: "radial-gradient(ellipse, rgba(245,166,35,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{ top: ["-4%", "106%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatDelay: 9 }}
        style={{
          position: "absolute", left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.18), transparent)",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(9,9,11,0.78) 100%)",
      }} />
    </div>
  );
}

export default function Hero({ onStart, onHowItWorks }) {
  const [primaryHover, setPrimaryHover] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 22 });
  const tx = useTransform(springX, [-1, 1], [-6, 6]);
  const ty = useTransform(springY, [-1, 1], [-4, 4]);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };
  const resetMouse = () => { mouseX.set(0); mouseY.set(0); };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.11 } } };
  const up = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.25, 0.1, 0.25, 1] } } };

  return (
    <section
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      style={{
        position: "relative",
        minHeight: "calc(100vh - 60px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 24px", textAlign: "center",
        overflow: "hidden",
      }}
    >
      <GridBackground />

      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "relative", zIndex: 1,
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "7px 20px", borderRadius: 28,
          border: "1px solid rgba(245,166,35,0.22)",
          background: "rgba(245,166,35,0.05)",
          marginBottom: 48,
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5a623", display: "inline-block" }}
        />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.22em", color: "rgba(245,166,35,0.8)" }}>
          PREPFORGE · AI INTERVIEW SIMULATOR
        </span>
      </motion.div>

      <motion.div
        style={{ x: tx, y: ty, position: "relative", zIndex: 1, marginBottom: 36, maxWidth: 920 }}
        variants={container} initial="hidden" animate="show"
      >
        <motion.div variants={up}>
          <span style={{
            display: "block",
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontStyle: "italic",
            fontSize: "clamp(54px, 7.8vw, 104px)",
            fontWeight: 700,
            letterSpacing: "-0.048em",
            lineHeight: 1,
            color: "rgba(228,224,216,0.22)",
            marginBottom: 12,
          }}>
            Stop Practicing.
          </span>
        </motion.div>

        <motion.div variants={up}>
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "block",
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(54px, 7.8vw, 104px)",
              fontWeight: 800,
              letterSpacing: "-0.048em",
              lineHeight: 1.06,
              marginBottom: 4,
              background: "linear-gradient(128deg, #e8940f 0%, #f5a623 28%, #ffe08a 56%, #f5a623 78%, #e8940f 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 52px rgba(245,166,35,0.34))",
            }}
          >
            {" "}
            <em style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontStyle: "italic",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}>
             Start Performing.
            </em>
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.48, duration: 0.72 }}
        style={{
          position: "relative", zIndex: 1,
          fontFamily: "'Space Mono', monospace",
          fontSize: "clamp(13px, 1.8vw, 16px)",
          color: "rgba(161,161,170,0.72)",
          marginBottom: 24,
          letterSpacing: "0.02em",
        }}
      >
        Practice your <Typewriter /> with AI that actually challenges you.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "relative", zIndex: 1,
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(15px, 1.9vw, 18px)",
          color: "rgba(161,161,170,0.65)",
          lineHeight: 1.82,
          maxWidth: 520,
          marginBottom: 64,
          letterSpacing: "0.01em",
        }}
      >
        An AI interviewer that{" "}
        <em style={{ fontStyle: "italic", color: "rgba(228,224,216,0.88)" }}>pushes you to think</em>
        {" "}— withholds answers, evaluates your reasoning, and tells you the truth.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ position: "relative", zIndex: 1, display: "flex", gap: 14, marginBottom: 72, flexWrap: "wrap", justifyContent: "center" }}
      >
        <motion.button
          onClick={onStart}
          onHoverStart={() => setPrimaryHover(true)}
          onHoverEnd={() => setPrimaryHover(false)}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#f5a623", color: "#000",
            fontFamily: "'Syne', sans-serif",
            fontSize: 16, fontWeight: 700,
            padding: "15px 38px", borderRadius: 4,
            border: "none", cursor: "pointer",
            letterSpacing: "0.01em",
            boxShadow: primaryHover
              ? "0 0 0 1px rgba(245,166,35,0.5), 0 10px 40px rgba(245,166,35,0.38)"
              : "0 0 0 1px rgba(245,166,35,0.25), 0 6px 24px rgba(245,166,35,0.18)",
            transition: "box-shadow 0.3s ease",
            position: "relative", overflow: "hidden",
          }}
        >
          <motion.span
            animate={{ x: ["-130%", "250%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)", pointerEvents: "none" }}
          />
          Start Interview
          <motion.span
            animate={{ x: primaryHover ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 320 }}
          >
            <ArrowRight size={17} strokeWidth={2.2} />
          </motion.span>
        </motion.button>

        <motion.button
          onClick={onHowItWorks}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            background: "transparent", color: "rgba(161,161,170,0.72)",
            fontFamily: "'Syne', sans-serif",
            fontSize: 16, fontWeight: 500,
            padding: "15px 32px", borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer", transition: "border-color 0.25s, color 0.25s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,166,35,0.35)"; e.currentTarget.style.color = "rgba(228,224,216,0.88)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(161,161,170,0.72)"; }}
        >
          <Play size={14} strokeWidth={2} />
          How it works
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.82, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "relative", zIndex: 1,
          display: "flex",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, overflow: "hidden",
          background: "rgba(17,17,19,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        {[
          { to: 10000, suffix: "+", label: "INTERVIEWS" },
          { to: 94,    suffix: "%", label: "SUCCESS RATE" },
          { to: 3,     suffix: "",  label: "DOMAINS" },
        ].map(({ to, suffix, label }, i, arr) => (
          <div key={label} style={{
            padding: "20px 38px", textAlign: "center",
            borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: "#f5a623" }}>
              <Counter to={to} suffix={suffix} />
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(82,82,91,0.9)", letterSpacing: "0.18em", marginTop: 6 }}>
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(82,82,91,0.7)", letterSpacing: "0.26em" }}>SCROLL</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path d="M1 1l6 6 6-6" stroke="rgba(82,82,91,0.6)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}