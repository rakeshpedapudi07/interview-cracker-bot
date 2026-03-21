import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuestionTimer from "./QuestionTimer";
import ProgressBar from "./ProgressBar";
import SolutionConfirmModal from "./SolutionConfirmModal";
import SessionSummary from "./SessionSummary";

const OPENROUTER_KEY = "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"; 
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const SYSTEM_PROMPT = (topic, qNum, total) =>
  `You are a strict but fair senior engineer conducting a live ${topic} technical interview.
SESSION: Question ${qNum} of ${total}.

RULES:
1. Ask ONE clear technical question related to ${topic}.
2. NEVER give the full answer unless user explicitly says "show solution".
3. If answer is wrong: probe — "Are you sure? Think about edge cases."
4. If partially right: "You're on the right track. What about X?"
5. If correct: acknowledge briefly, then write NEXT_QUESTION on its own line.
6. For hints: one directional nudge only, no code, no full answer.
7. Keep all responses under 100 words. Be sharp and concise.
8. After every user answer (not hints or solutions), end your reply with EXACTLY this block:
---EVAL---
GRADE: Strong
FEEDBACK: one honest sentence about their answer
---END---
Replace Strong with Average or Weak based on answer quality.
9. Do NOT include the ---EVAL--- block for hint responses.
10. Start by asking question ${qNum} of ${total} for ${topic}. No preamble.`;

function parseEval(text) {
  const match = text.match(
    /---EVAL---\s*GRADE:\s*(\w+)\s*FEEDBACK:\s*(.+?)\s*---END---/s
  ) || text.match(
    /GRADE:\s*(\w+)\s*FEEDBACK:\s*(.+?)(?:\n---|\n\n|$)/s
  );
  
  if (!match) return { clean: text, evaluation: null };
  
  const clean = text
    .replace(/---EVAL---[\s\S]*?---END---/, "")
    .replace(/GRADE:\s*\w+\s*FEEDBACK:[\s\S]*$/, "")
    .trim();
    
  return { 
    clean, 
    evaluation: { 
      grade: match[1].trim(), 
      feedback: match[2].trim() 
    } 
  };
}

async function callAPI(systemPrompt, messages) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Interview Cracker Bot",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
          .filter((m) => !m.hidden)
          .map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`${res.status}: ${errBody}`);
  }

  const data = await res.json();

  // Handle all possible response shapes
  const content =
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.content?.[0]?.text ||
    null;

  if (!content) {
    console.error("Unexpected API response shape:", JSON.stringify(data));
    throw new Error("Empty response from model. Try again.");
  }

  return content;
}

export default function ChatScreen({ topic, totalQuestions, onExit }) {
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
  const currentQuestionRef = useRef(1);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  const toAPIHistory = (msgs) =>
    msgs
      .filter((m) => !m.hidden)
      .map((m) => ({ role: m.role, content: m.content }));

  // ── Init first question ──
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      setLoading(true);
      setLoadingState("loading");
      try {
        const raw = await callAPI(
          `You are starting a ${topic} interview. Ask question 1 of ${totalQuestions} directly. No preamble. No intro. Just the question.`,
          [{ role: "user", content: `Start. Ask me question 1 of ${totalQuestions} about ${topic}.` }]
        );
        const { clean } = parseEval(raw);
        setMessages([
          { role: "assistant", content: clean, id: Date.now(), questionNum: 1 },
        ]);
        setTimerActive(true);
      } catch (e) {
        setError("Failed to start session: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Advance to next question ──
  const advanceQuestion = useCallback(
    (qNum) => {
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
            {
              role: "user",
              content: `Good. Now ask me question ${next} of ${totalQuestions}.`,
              id: Date.now(),
              hidden: true,
            },
          ];

          (async () => {
            setLoading(true);
            setLoadingState("loading");
            try {
              const raw = await callAPI(
                SYSTEM_PROMPT(topic, next, totalQuestions),
                toAPIHistory(bridge)
              );
              const { clean } = parseEval(raw);
              setMessages((p) => [
                ...p,
                {
                  role: "assistant",
                  content: clean,
                  id: Date.now() + 1,
                  questionNum: next,
                },
              ]);
              setTimerActive(true);
            } catch (e) {
              setError("Error loading next question: " + e.message);
            } finally {
              setLoading(false);
            }
          })();

          return bridge;
        });
      }, 500);
    },
    [topic, totalQuestions]
  );

  // ── Send a message ──
  const sendMessage = useCallback(
    (userContent, opts = {}) => {
      const { isHint = false, isSolution = false } = opts;
      if (!userContent.trim() || loading) return;

      const userMsg = {
        role: "user",
        content: userContent,
        id: Date.now(),
        isHint,
        isSolution,
      };

      setMessages((prev) => {
        const next = [...prev, userMsg];

        (async () => {
          setLoading(true);
          setTimerActive(false);
          setLoadingState("thinking");
          setError(null);

          try {
            const qNum = currentQuestionRef.current;
            const raw = await callAPI(
              SYSTEM_PROMPT(topic, qNum, totalQuestions),
              toAPIHistory(next)
            );
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

            if (evaluation && !isHint && !isSolution) {
              setMessages((p) => {
                const withEval = p.map((m, i) =>
                  i === p.length - 1 && m.role === "user"
                    ? { ...m, evaluation }
                    : m
                );
                return [...withEval, botMsg];
              });
              setEvaluations((p) => [...p, evaluation]);

              if (
                signalsNext ||
                evaluation.grade === "Strong" ||
                evaluation.grade === "Good"
              ) {
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
    },
    [loading, topic, totalQuestions, advanceQuestion]
  );

  const handleSend = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput("");
    sendMessage(t);
  };

  const handleHint = () => {
    if (loading || hintCount >= 3) return;
    const step = hintCount + 1;
    setHintCount((c) => c + 1);
    sendMessage(
      `Give me hint ${step} for this question. One nudge only, no full answer.`,
      { isHint: true }
    );
  };

  const handleSolutionConfirm = () => {
    setShowSolutionModal(false);
    sendMessage(
      "Show me the complete solution and full explanation for this question.",
      { isSolution: true }
    );
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const visibleMessages = messages.filter((m) => !m.hidden);
  const hintsLeft = 3 - hintCount;

  if (sessionDone) {
    return (
      <SessionSummary
        evaluations={evaluations}
        topic={topic}
        totalQuestions={totalQuestions}
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
            Question{" "}
            <span className="sidebar-qnum">{currentQuestion}</span>
            <span className="sidebar-qtotal"> / {totalQuestions}</span>
          </p>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">TIME THIS QUESTION</p>
          <QuestionTimer
            active={timerActive && !loading}
            questionNum={currentQuestion}
            warningAfter={90}
          />
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">DOMAIN</p>
          <p className="sidebar-value topic-badge">{topic}</p>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">SESSION</p>
          <p className="sidebar-value mono">#{String(sessionId).slice(-6)}</p>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <p className="sidebar-label">ACTIONS</p>
          <button
            className="sidebar-action"
            onClick={handleHint}
            disabled={loading || hintCount >= 3}
          >
            <span>💡</span>
            <span>Hint</span>
            <span className="sidebar-action-badge">{hintsLeft} left</span>
          </button>
          <button
            className="sidebar-action sidebar-action--warn"
            onClick={() => setShowSolutionModal(true)}
            disabled={loading}
          >
            <span>🔓</span> Show Solution
          </button>
        </div>

        <div className="sidebar-spacer" />

        <button className="exit-btn" onClick={onExit}>
          ← Exit Interview
        </button>
      </aside>

      {/* ── Main Chat ── */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <span className="interviewer-avatar">AI</span>
            <div>
              <p className="interviewer-name">Senior Interviewer</p>
              <p className="interviewer-status">
                <span
                  className={`status-dot ${loading ? "status-dot--pulse" : ""}`}
                />
                {loading ? "Evaluating..." : timerActive ? "Listening" : "Active"}
              </p>
            </div>
          </div>
          <div className="chat-header-right">
            <span className="topic-chip">{topic}</span>
            <span className="qnum-chip">
              Q{currentQuestion}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress strip */}
        <div className="chat-progress-strip">
          <div
            className="chat-progress-fill"
            style={{
              width: `${((currentQuestion - 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>

        {/* Messages */}
        <div className="messages-area">
          {visibleMessages.length === 0 && !loading && (
            <div className="empty-state">
              <span className="empty-icon">◈</span>
              <p className="empty-text">Initializing interview session…</p>
            </div>
          )}

          {visibleMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loading && <TypingIndicator state={loadingState} />}

          {error && (
            <div className="error-banner">
              <span>⚠</span> {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
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
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              →
            </button>
          </div>

          <div className="input-actions">
            <button
              className="action-pill"
              onClick={handleHint}
              disabled={loading || hintCount >= 3}
            >
              💡 Hint {hintCount > 0 && `(${hintsLeft} left)`}
            </button>
            <button
              className="action-pill action-pill--warn"
              onClick={() => setShowSolutionModal(true)}
              disabled={loading}
            >
              🔓 Solution
            </button>
            <span className="char-hint">Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}