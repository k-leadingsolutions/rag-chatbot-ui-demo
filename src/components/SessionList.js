import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Typography,
  TextField,
  Divider,
  Pagination,
  CircularProgress,
  Tooltip,
  Paper,
  Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  getSessions,
  createSession,
  deleteSession,
  renameSession,
  toggleFavorite
} from "../api/storage";

export default function SessionList({
  selectedSessionId,
  onSelectSession,
  onSessionCreated,
  onSessionDeleted,
  onSessionRenamed
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [favLoading, setFavLoading] = useState(null);

  useEffect(() => {
    fetchSessions(page - 1);
    // eslint-disable-next-line
  }, [page]);

  const fetchSessions = async (pageIdx = 0) => {
    setLoading(true);
    try {
      const { data } = await getSessions(pageIdx, 10);
      setSessions(data.content);
      setTotalPages(data.totalPages || 1);
    } catch {
      setSessions([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newTitle) return;
    const { data } = await createSession(newTitle);
    setNewTitle("");
    fetchSessions(page - 1);
    onSessionCreated && onSessionCreated(data);
  };

  const handleDelete = async (id) => {
    await deleteSession(id);
    fetchSessions(page - 1);
    onSessionDeleted && onSessionDeleted(id);
  };

  const handleRename = async (id) => {
    if (!editingTitle.trim()) return;
    await renameSession(id, editingTitle);
    setEditingId(null);
    setEditingTitle("");
    fetchSessions(page - 1);
    onSessionRenamed && onSessionRenamed(id, editingTitle);
  };

  const handleToggleFavorite = async (sessionId) => {
    setFavLoading(sessionId);
    try {
      await toggleFavorite(sessionId);
      fetchSessions(page - 1);
    } catch (e) {
      alert("Failed to toggle favorite");
    }
    setFavLoading(null);
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Paper elevation={0} sx={{ p: 2, pb: 1, bgcolor: "#f7fafc" }}>
        <Typography variant="h6" gutterBottom fontWeight={700} color="primary.main">
          Sessions
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            size="small"
            label="New Session"
            variant="outlined"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            disabled={!newTitle}
            sx={{ minWidth: 0, borderRadius: 2 }}
          >
            Add
          </Button>
        </Box>
      </Paper>
      <Divider />
      <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "56vh", px: 1 }}>
        {loading ? (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <List sx={{ overflowY: "auto" }}>
            {sessions.map(session => (
              <ListItem
                key={session.id}
                button
                onClick={() => onSelectSession(session.id)}
                selected={session.id === selectedSessionId}
                sx={{
                  borderRadius: 2,
                  bgcolor: session.id === selectedSessionId ? "primary.light" : undefined,
                  mb: 0.5,
                  transition: "background 0.2s",
                  "&:hover": {
                    bgcolor: "#e6eaf1"
                  }
                }}
              >
                {editingId === session.id ? (
                  <TextField
                    size="small"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    fullWidth
                    onKeyDown={e => {
                      if (e.key === "Enter") handleRename(session.id);
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <ListItemText
                      primary={session.title}
                      secondary={session.favorite ? "★ Favourite" : ""}
                      primaryTypographyProps={{ fontWeight: session.id === selectedSessionId ? 700 : 400 }}
                      sx={{ cursor: "pointer" }}
                    />
                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Rename">
                          <IconButton size="small" onClick={() => {
                            setEditingId(session.id);
                            setEditingTitle(session.title);
                          }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={session.favorite ? "Unmark Favorite" : "Mark as Favorite"}>
                          <span>
                            <IconButton
                              color={session.favorite ? "secondary" : "default"}
                              size="small"
                              onClick={() => handleToggleFavorite(session.id)}
                              disabled={favLoading === session.id}
                            >
                              {session.favorite ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" size="small" onClick={() => handleDelete(session.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Divider />
      <Box sx={{ py: 1, display: "flex", justifyContent: "center" }}>
        <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
      </Box>
    </Box>
  );
}