import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuestionTimer from "./QuestionTimer";
import ProgressBar from "./ProgressBar";
import SolutionConfirmModal from "./SolutionConfirmModal";
import SessionSummary from "./SessionSummary";
import VoiceInput from "./VoiceInput";
import CodeEditor from "./CodeEditor";

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const COMPANY_PERSONAS = {
  Amazon: "You interview in the style of Amazon. You heavily reference Leadership Principles. You probe for ownership, customer obsession, and data-driven thinking. You are strict and follow up aggressively.",
  Google: "You interview in the style of Google. You probe deep conceptual understanding, scalability thinking, and algorithmic complexity. You ask 'why' repeatedly.",
  Startup: "You interview in the style of a startup. You value practical execution, speed, and pragmatism over theoretical perfection. You ask about trade-offs and shipping.",
  Generic: "You use a balanced professional interview style.",
};

const SYSTEM_PROMPT = (topic, qNum, total, company) =>
  `You are a strict but fair senior engineer conducting a live ${topic} technical interview.
SESSION: Question ${qNum} of ${total}. Company style: ${company}.
${COMPANY_PERSONAS[company] || COMPANY_PERSONAS.Generic}

RULES:
1. Ask ONE clear technical question related to ${topic}.
2. NEVER give the full answer unless user explicitly says "show solution".
3. If answer is wrong: probe — "Are you sure? Think about edge cases."
4. If partially right: "You're on the right track. What about X?"
5. If correct: acknowledge briefly, then write NEXT_QUESTION on its own line.
6. For hints: one directional nudge only, no full answer.
7. Keep all responses under 120 words. Be sharp.
8. After every user answer (not hints/solutions), end with EXACTLY:
---EVAL---
GRADE: Strong
FEEDBACK: one honest sentence
---END---
Replace Strong with Average or Weak as appropriate.
9. Do NOT include ---EVAL--- for hints.`;

function parseEval(text) {
  const match = text.match(/---EVAL---\s*GRADE:\s*(\w+)\s*FEEDBACK:\s*(.+?)\s*---END---/s)
    || text.match(/GRADE:\s*(\w+)\s*FEEDBACK:\s*(.+?)(?:\n---|$)/s);
  if (!match) return { clean: text, evaluation: null };
  const clean = text
    .replace(/---EVAL---[\s\S]*?---END---/, "")
    .replace(/GRADE:\s*\w+\s*FEEDBACK:[\s\S]*$/, "")
    .trim();
  return { clean, evaluation: { grade: match[1].trim(), feedback: match[2].trim() } };
}

async function callAPI(systemPrompt, messages) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_KEY}`,
      "HTTP-Referer": "https://interview-cracker-bot.vercel.app",
      "X-Title": "Interview Cracker Bot",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.filter((m) => !m.hidden).map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status}: ${err}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content
    || data?.choices?.[0]?.text
    || data?.content?.[0]?.text
    || null;
  if (!content) throw new Error("Empty response. Try again.");
  return content;
}

// Typing animation hook
function useTypingEffect(text, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return { displayed, done };
}

export default function ChatScreen({ topic, totalQuestions, company, mode, onExit }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState("loading");
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => Date.now());
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timerActive, setTimerActive] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [lastBotText, setLastBotText] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const currentQuestionRef = useRef(1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  const toAPIHistory = (msgs) =>
    msgs.filter((m) => !m.hidden).map((m) => ({ role: m.role, content: m.content }));

  // Typing animation for last bot message
  const { displayed: typedText, done: typingDone } = useTypingEffect(
    showTyping ? lastBotText : "", 14
  );

  // Init
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      setLoading(true);
      setLoadingState("loading");
      try {
        const raw = await callAPI(
          `You are starting a ${topic} interview (${company} style). Ask question 1 of ${totalQuestions} directly. No preamble.`,
          [{ role: "user", content: `Start. Ask me question 1 of ${totalQuestions} about ${topic}.` }]
        );
        const { clean } = parseEval(raw);
        setLastBotText(clean);
        setShowTyping(true);
        setMessages([{ role: "assistant", content: clean, id: Date.now(), questionNum: 1 }]);
        setTimerActive(true);
      } catch (e) {
        setError("Failed to start: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const advanceQuestion = useCallback((qNum) => {
    const next = qNum + 1;
    if (next > totalQuestions) {
      setSessionDone(true);
      setTimerActive(false);
      return;
    }
    setCurrentQuestion(next);
    currentQuestionRef.current = next;
    setHintCount(0);
    setTimerActive(false);

    setTimeout(() => {
      setMessages((prev) => {
        const bridge = [
          ...prev,
          { role: "user", content: `Good. Now ask me question ${next} of ${totalQuestions}.`, id: Date.now(), hidden: true },
        ];
        (async () => {
          setLoading(true);
          setLoadingState("loading");
          try {
            const raw = await callAPI(SYSTEM_PROMPT(topic, next, totalQuestions, company), toAPIHistory(bridge));
            const { clean } = parseEval(raw);
            setLastBotText(clean);
            setShowTyping(true);
            setMessages((p) => [...p, { role: "assistant", content: clean, id: Date.now() + 1, questionNum: next }]);
            setTimerActive(true);
          } catch (e) {
            setError("Error loading question: " + e.message);
          } finally {
            setLoading(false);
          }
        })();
        return bridge;
      });
    }, 500);
  }, [topic, totalQuestions, company]);

  const sendMessage = useCallback((userContent, opts = {}) => {
    const { isHint = false, isSolution = false } = opts;
    if (!userContent.trim() || loading) return;

    const userMsg = { role: "user", content: userContent, id: Date.now(), isHint, isSolution };

    setMessages((prev) => {
      const next = [...prev, userMsg];
      (async () => {
        setLoading(true);
        setTimerActive(false);
        setLoadingState("thinking");
        setError(null);
        try {
          const qNum = currentQuestionRef.current;
          const raw = await callAPI(SYSTEM_PROMPT(topic, qNum, totalQuestions, company), toAPIHistory(next));
          const { clean, evaluation } = parseEval(raw);
          const signalsNext = clean.includes("NEXT_QUESTION");
          const displayText = clean.replace(/NEXT_QUESTION/g, "").trim();

          const botMsg = {
            role: "assistant",
            content: displayText,
            id: Date.now() + 1,
            questionNum: !isHint && !isSolution ? qNum : undefined,
            isHint,
            isSolution,
          };

          setLastBotText(displayText);
          setShowTyping(true);

          if (evaluation && !isHint && !isSolution) {
            setMessages((p) => {
              const withEval = p.map((m, i) =>
                i === p.length - 1 && m.role === "user" ? { ...m, evaluation } : m
              );
              return [...withEval, botMsg];
            });
            setEvaluations((p) => [...p, evaluation]);
            if (signalsNext || evaluation.grade === "Strong" || evaluation.grade === "Good") {
              setTimeout(() => advanceQuestion(qNum), 1500);
            } else {
              setTimerActive(true);
            }
          } else {
            setMessages((p) => [...p, botMsg]);
            setTimerActive(true);
          }
        } catch (e) {
          setError("API error: " + e.message);
        } finally {
          setLoading(false);
        }
      })();
      return next;
    });
  }, [loading, topic, totalQuestions, company, advanceQuestion]);

  const handleSend = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput("");
    sendMessage(t);
  };

  const handleHint = () => {
    if (loading || hintCount >= 3) return;
    setHintCount((c) => c + 1);
    sendMessage(`Give me hint ${hintCount + 1}. One nudge only, no full answer.`, { isHint: true });
  };

  const handleSolutionConfirm = () => {
    setShowSolutionModal(false);
    sendMessage("Show me the complete solution and full explanation.", { isSolution: true });
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleVoiceTranscript = (text) => {
    setInput(text);
  };

  const visibleMessages = messages.filter((m) => !m.hidden);
  const hintsLeft = 3 - hintCount;
  const companyColor = { Amazon: "#ff9900", Google: "#4285f4", Startup: "#4ade80", Generic: "#888" }[company] || "#888";

  if (sessionDone) {
    return (
      <SessionSummary
        evaluations={evaluations}
        topic={topic}
        totalQuestions={totalQuestions}
        company={company}
        onRetry={onExit}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="chat-root">
      {showSolutionModal && (
        <SolutionConfirmModal
          onConfirm={handleSolutionConfirm}
          onCancel={() => setShowSolutionModal(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className="chat-sidebar">
        <div className="sidebar-logo">IC_BOT</div>

        <div className="sidebar-section">
          <ProgressBar current={currentQuestion - 1} total={totalQuestions} />
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <p className="sidebar-label">CURRENT</p>
          <p className="sidebar-current-q">
            Question <span className="sidebar-qnum">{currentQuestion}</span>
            <span className="sidebar-qtotal"> / {totalQuestions}</span>
          </p>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">TIME THIS QUESTION</p>
          <QuestionTimer active={timerActive && !loading} questionNum={currentQuestion} warningAfter={90} />
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">DOMAIN</p>
          <p className="sidebar-value topic-badge">{topic}</p>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">COMPANY MODE</p>
          <p className="sidebar-value" style={{ color: companyColor, fontFamily: "var(--font-mono)", fontSize: "12px" }}>
            {company}
          </p>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">SESSION</p>
          <p className="sidebar-value mono">#{String(sessionId).slice(-6)}</p>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <p className="sidebar-label">ACTIONS</p>
          <button className="sidebar-action" onClick={handleHint} disabled={loading || hintCount >= 3}>
            <span>💡</span><span>Hint</span>
            <span className="sidebar-action-badge">{hintsLeft} left</span>
          </button>
          <button className="sidebar-action sidebar-action--warn" onClick={() => setShowSolutionModal(true)} disabled={loading}>
            <span>🔓</span> Show Solution
          </button>
        </div>

        <div className="sidebar-spacer" />
        <button className="exit-btn" onClick={onExit}>← Exit Interview</button>
      </aside>

      {/* ── Main ── */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <span className="interviewer-avatar">AI</span>
            <div>
              <p className="interviewer-name">Senior Interviewer</p>
              <p className="interviewer-status">
                <span className={`status-dot ${loading ? "status-dot--pulse" : ""}`} />
                {loading ? "Evaluating..." : timerActive ? "Listening" : "Active"}
              </p>
            </div>
          </div>
          <div className="chat-header-right">
            <span className="topic-chip">{topic}</span>
            <span className="qnum-chip">Q{currentQuestion}/{totalQuestions}</span>
            <span className="company-chip" style={{ color: companyColor, borderColor: companyColor + "44", backgroundColor: companyColor + "11" }}>
              {company}
            </span>
          </div>
        </div>

        <div className="chat-progress-strip">
          <div className="chat-progress-fill" style={{ width: `${((currentQuestion - 1) / totalQuestions) * 100}%` }} />
        </div>

        {/* Messages */}
        <div className="messages-area">
          {visibleMessages.length === 0 && !loading && (
            <div className="empty-state">
              <span className="empty-icon">◈</span>
              <p className="empty-text">Initializing interview session…</p>
            </div>
          )}

          {visibleMessages.map((msg, idx) => {
            const isLast = idx === visibleMessages.length - 1;
            const isLastBot = isLast && msg.role === "assistant";
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                displayText={isLastBot && showTyping && !typingDone ? typedText : msg.content}
                isTyping={isLastBot && showTyping && !typingDone}
              />
            );
          })}

          {loading && <TypingIndicator state={loadingState} />}

          {error && (
            <div className="error-banner">
              <span>⚠</span> {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="input-area">
          {/* Code mode */}
          {mode === "code" && (
            <div className="code-mode-wrap">
              <CodeEditor topic={topic} onSubmit={(code) => sendMessage(code)} disabled={loading} />
            </div>
          )}

          {/* Chat / Voice mode */}
          {mode !== "code" && (
            <>
              <div className="input-row">
                <div className="input-wrapper">
                  <textarea
                    ref={inputRef}
                    className="chat-input"
                    placeholder="Type your answer… (Enter to send · Shift+Enter for newline)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    rows={1}
                    disabled={loading}
                  />
                </div>
                <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>→</button>
              </div>

              <div className="input-actions">
                {mode === "voice" && (
                  <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
                )}
                <button className="action-pill" onClick={handleHint} disabled={loading || hintCount >= 3}>
                  💡 Hint {hintCount > 0 && `(${hintsLeft} left)`}
                </button>
                <button className="action-pill action-pill--warn" onClick={() => setShowSolutionModal(true)} disabled={loading}>
                  🔓 Solution
                </button>
                <span className="char-hint">Shift+Enter for new line</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}