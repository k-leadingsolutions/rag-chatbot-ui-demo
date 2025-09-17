import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSend({ message: value.trim() });
      setValue("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        placeholder="Type your message..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <Button type="submit" variant="contained" color="primary" disabled={disabled || !value.trim()}>
        Send
      </Button>
    </Box>
  );
}