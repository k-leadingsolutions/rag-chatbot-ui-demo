import React, { useState } from "react";
import { Box, TextField, Button, IconButton, Paper, Tooltip, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export default function ChatWithOptionalUpload({ onSend, disabled }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) {
      setStatus("Please enter a message or select a file.");
      return;
    }
    setSending(true);
    setStatus("");
    try {
      await onSend({ message: message.trim(), file });
      setMessage("");
      setFile(null);
    } catch (err) {
      setStatus("Error: " + (err.message || "Failed to send"));
    }
    setSending(false);
  };

  return (
    <Paper
      elevation={5}
      sx={{
        p: 2,
        borderTop: "1px solid #eee",
        bgcolor: "#f9fbfd"
      }}
      component="form"
      onSubmit={handleSend}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip title="Attach a document">
          <IconButton
            component="label"
            disabled={disabled || sending}
            sx={{ borderRadius: 2 }}
          >
            <AttachFileIcon />
            <input
              type="file"
              hidden
              onChange={e => setFile(e.target.files[0])}
              disabled={disabled || sending}
            />
          </IconButton>
        </Tooltip>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type your message (and/or attach a file)…"
          value={message}
          disabled={disabled || sending}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(e);
            }
          }}
          sx={{
            bgcolor: "#fff",
            borderRadius: 2
          }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={sending ? <CircularProgress size={18} /> : <SendIcon />}
          type="submit"
          disabled={disabled || sending || (!message.trim() && !file)}
          sx={{
            minWidth: 48,
            borderRadius: 2
          }}
        >
          Send
        </Button>
      </Box>
      <Box sx={{ mt: 1, minHeight: 18 }}>
        {file && (
          <span style={{
            fontSize: 13,
            color: "#666",
            background: "#f0f0f0",
            borderRadius: 4,
            padding: "2px 8px",
            marginRight: 8
          }}>
            {file.name}
          </span>
        )}
        {status && (
          <span style={{ color: "red", fontSize: 13 }}>{status}</span>
        )}
      </Box>
    </Paper>
  );
}