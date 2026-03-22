import { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import ChatScreen from "./components/ChatScreen";

export default function App() {
  const [session, setSession] = useState(null);

  return (
    <div className="app-root">
      {!session ? (
        <LandingScreen
          onStart={(topic, totalQuestions, company, mode) =>
            setSession({ topic, totalQuestions, company, mode })
          }
        />
      ) : (
        <ChatScreen
          topic={session.topic}
          totalQuestions={session.totalQuestions}
          company={session.company}
          mode={session.mode}
          onExit={() => setSession(null)}
        />
      )}
    </div>
  );
}