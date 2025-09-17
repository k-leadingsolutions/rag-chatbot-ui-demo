import React, { useState, useEffect, useCallback } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { queryRAG } from "../api/rag";
import { saveMessageToSession, getSessionMessages } from "../api/storage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ChatWindow({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (sessionId) {
        let msgs = await getSessionMessages(sessionId);
        if (Array.isArray(msgs)) setMessages(msgs);
        else if (msgs?.messages && Array.isArray(msgs.messages)) setMessages(msgs.messages);
        else if (msgs?.data && Array.isArray(msgs.data)) setMessages(msgs.data);
        else setMessages([]);
      }
    })();
  }, [sessionId]);

  const handleSend = useCallback(
    async ({ message }) => {
      setLoading(true);
      try {
        const answer = await queryRAG(message, {});
        await saveMessageToSession(sessionId, [
          { role: "USER", content: message },
          { role: "AI", content: answer }
        ]);
        setMessages(prev => [
          ...prev,
          { role: "USER", content: message },
          { role: "AI", content: answer }
        ]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  return (
    <>
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </>
  );
}