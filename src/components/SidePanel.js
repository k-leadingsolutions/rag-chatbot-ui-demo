import React, { useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ToggleButton,
  IconButton,
  TextField
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function SidePanel({
  sessions = [],
  onSelectSession,
  selectedSessionId,
  onToggleFavorite,
  onDeleteSession,
  onRenameSession,
  recentMessages = [],
  onSelectRecentMessage
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");


  const startEdit = (session) => {
    setEditingId(session.id);
    setEditValue(session.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const confirmEdit = () => {
    if (editValue.trim() && onRenameSession) {
      onRenameSession(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f9fafd"
      }}
    >
      <Typography variant="h6" color="primary.main" fontWeight={700} gutterBottom>
        Chat Sessions
      </Typography>
      <List dense sx={{ mb: 2, maxHeight: 120, overflowY: "auto" }}>
        {sessions.map((session) => (
          <ListItem
            key={session.id}
            disablePadding
            secondaryAction={
              editingId === session.id ? (
                <>
                  <IconButton
                    aria-label="confirm"
                    color="primary"
                    size="small"
                    onClick={confirmEdit}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    aria-label="cancel"
                    color="default"
                    size="small"
                    onClick={cancelEdit}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <div>
                  <IconButton
                    aria-label="rename"
                    color="primary"
                    size="small"
                    onClick={() => startEdit(session)}
                  >
                    <EditIcon />
                  </IconButton>
                  <ToggleButton
                    value="favorite"
                    selected={!!session.favorite}
                    onChange={() => onToggleFavorite(session.id)}
                    size="small"
                    aria-label={session.favorite ? "Unfavorite" : "Favorite"}
                    sx={{ p: 0, minWidth: 36, mr: 1 }}
                  >
                    {session.favorite ? (
                      <StarIcon color="warning" />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </ToggleButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    size="small"
                    onClick={() => onDeleteSession(session.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )
            }
          >
            <ListItemButton
              selected={session.id === selectedSessionId}
              onClick={() => onSelectSession(session.id)}
              sx={{ borderRadius: 2 }}
              disabled={editingId === session.id}
            >
              {editingId === session.id ? (
                <TextField
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  size="small"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === "Enter") confirmEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
              ) : (
                <ListItemText primary={session.title} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle1" fontWeight={600} color="text.secondary" gutterBottom>
        Recent Messages
      </Typography>
      <List dense sx={{ mb: 2, maxHeight: 110, overflowY: "auto" }}>
        {recentMessages.map((msg, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton onClick={() => onSelectRecentMessage(msg)}>
              <ListItemText
                primary={
                  msg.content.length > 30
                    ? msg.content.slice(0, 30) + "..."
                    : msg.content
                }
                secondary={msg.role === "USER" ? "You" : "AI"}
                secondaryTypographyProps={{
                  color:
                    msg.role === "USER" ? "primary.main" : "secondary.main"
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}