import { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import ChatScreen from "./components/ChatScreen";

export default function App() {
  const [session, setSession] = useState(null);

  return (
    <div className="app-root">
      {!session ? (
        <LandingScreen
          onStart={(topic, totalQuestions) => setSession({ topic, totalQuestions })}
        />
      ) : (
        <ChatScreen
          topic={session.topic}
          totalQuestions={session.totalQuestions}
          onExit={() => setSession(null)}
        />
      )}
    </div>
  );
}