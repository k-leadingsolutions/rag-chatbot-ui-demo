import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Avatar, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 1, bgcolor: "#f5f7fa" }}>
      <Stack spacing={2}>
        {messages.map((msg, i) => {
          const isUser = msg.role === "USER";
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-end",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: isUser ? "primary.main" : "secondary.main",
                  mb: "auto",
                  ml: isUser ? 2 : 0,
                  mr: !isUser ? 2 : 0,
                  width: 36,
                  height: 36
                }}
              >
                {isUser ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  bgcolor: isUser ? "primary.main" : "#fff",
                  color: isUser ? "#fff" : "#222",
                  borderRadius: 3,
                  borderTopRightRadius: isUser ? "8px" : "28px",
                  borderTopLeftRadius: isUser ? "28px" : "8px",
                  maxWidth: "70%",
                  minWidth: "60px",
                  boxShadow: 2,
                  ml: isUser ? 0 : 1,
                  mr: isUser ? 1 : 0,
                  position: "relative"
                }}
              >
                <Typography variant="body2" fontWeight="bold" sx={{ opacity: 0.7 }}>
                  {isUser ? "You" : "AI Assistant"}
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
                  {msg.content}
                </Typography>
              </Paper>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Stack>
    </Box>
  );
}