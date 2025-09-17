import React, { useState, useEffect } from "react";
import AppLayout from "./components/AppLayout";
import SidePanel from "./components/SidePanel";
import ChatWindow from "./components/ChatWindow";
import { getSessions, getSessionMessages, toggleFavorite, createSession, deleteSession, renameSession } from "./api/storage";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);

  // Fetch sessions on mount, create one if none exist
  useEffect(() => {
    (async () => {
      let sess = await getSessions();
      let sessionList = sess.content || sess;
      if (!sessionList.length) {
        const newSession = await createSession("New Chat");
        sessionList = [newSession];
      }
      setSessions(sessionList);
      if (sessionList.length && !selectedSessionId) {
        setSelectedSessionId(sessionList[0].id);
      }
    })();
  }, []);

  // Fetch recent messages when session changes, using sessionStorage for caching
  useEffect(() => {
    if (selectedSessionId) {
      const stored = sessionStorage.getItem(`recentMessages-${selectedSessionId}`);
      if (stored) {
        setRecentMessages(JSON.parse(stored));
      } else {
        (async () => {
          const msgsRaw = await getSessionMessages(selectedSessionId);
          let msgs = [];
          if (Array.isArray(msgsRaw)) {
            msgs = msgsRaw;
          } else if (Array.isArray(msgsRaw?.messages)) {
            msgs = msgsRaw.messages;
          } else if (Array.isArray(msgsRaw?.data)) {
            msgs = msgsRaw.data;
          }
          const recent = msgs.slice(-5).reverse();
          setRecentMessages(recent);
          sessionStorage.setItem(`recentMessages-${selectedSessionId}`, JSON.stringify(recent));
        })();
      }
    }
  }, [selectedSessionId]);

  const handleToggleFavorite = async (sessionId) => {
    await toggleFavorite(sessionId);
    const sess = await getSessions();
    setSessions(sess.content || sess);
  };

  const handleSelectSession = (id) => setSelectedSessionId(id);

  const handleSelectRecentMessage = (msg) => {};

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    await deleteSession(sessionId);
    const sess = await getSessions();
    setSessions(sess.content || sess);
    if (sessionId === selectedSessionId && (sess.content?.length || sess.length)) {
      setSelectedSessionId((sess.content || sess)[0]?.id || null);
    } else if (!(sess.content?.length || sess.length)) {
      setSelectedSessionId(null);
      setRecentMessages([]);
    }
  };

  const handleRenameSession = async (sessionId, newTitle) => {
    try {
      await renameSession(sessionId, newTitle); // FIX: use correct function
      const sess = await getSessions();
      setSessions(sess.content || sess);
    } catch (err) {
      alert("Failed to rename session: " + err.message);
    }
  };

  return (
    <AppLayout
      left={
        <SidePanel
          sessions={sessions}
          onSelectSession={handleSelectSession}
          selectedSessionId={selectedSessionId}
          onToggleFavorite={handleToggleFavorite}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession} // FIX: add this prop
          recentMessages={recentMessages}
          onSelectRecentMessage={handleSelectRecentMessage}
        />
      }
      main={
        <ChatWindow
          sessionId={selectedSessionId}
        />
      }
    />
  );
}