import React, { useEffect, useState } from "react";
import { createSession } from "./storage"; // Adjust path as necessary
import ChatWindow from "./ChatWindow";     // Replace with your chat component

export default function ChatPage() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        const session = await createSession("New Chat");
        setSessionId(session.id); // session.id should be the UUID returned by backend
      } catch (err) {
        console.error("Failed to create session", err);
      } finally {
        setLoading(false);
      }
    }
    initSession();
  }, []);

  if (loading) return <div>Loading chat session...</div>;
  if (!sessionId) return <div>Could not start chat session.</div>;

  // Pass sessionId to your chat window/component
  return <ChatWindow sessionId={sessionId} />;
}