import { useState, useEffect, useRef } from "react";

export default function VoiceInput({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (e) => {
        let final = "";
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        setTranscript(final || interim);
        if (final) onTranscript(final.trim());
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggle = () => {
    if (!supported || disabled) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  if (!supported) return (
    <div className="voice-unsupported">
      🎙️ Voice not supported in this browser. Use Chrome.
    </div>
  );

  return (
    <div className="voice-wrap">
      <button
        className={`voice-btn ${listening ? "voice-btn--active" : ""}`}
        onClick={toggle}
        disabled={disabled}
        title={listening ? "Stop recording" : "Start speaking"}
      >
        <span className="voice-icon">{listening ? "⏹" : "🎙️"}</span>
        <span className="voice-label">{listening ? "Stop" : "Speak"}</span>
        {listening && <span className="voice-pulse" />}
      </button>

      {transcript && (
        <div className="voice-transcript">
          <span className="voice-transcript-label">Heard:</span>
          <span className="voice-transcript-text">"{transcript}"</span>
        </div>
      )}
    </div>
  );
}