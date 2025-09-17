import React from "react";
import { Box, AppBar, Toolbar, Typography, Avatar, CssBaseline } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";

export default function AppLayout({ left, main }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
            <GavelIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" letterSpacing={1} sx={{ flexGrow: 1 }}>
            DGE RAG Chat
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: "flex",
        gap: 3,
        p: { xs: 0.5, sm: 3 },
        maxWidth: "1700px",
        mx: "auto"
      }}>
        <Box sx={{
          width: 340,
          minWidth: 240,
          maxHeight: "85vh",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: 2,
          bgcolor: "#fff"
        }}>
          {left}
        </Box>
        <Box sx={{
          flex: 1,
          minWidth: 0,
          maxWidth: 900,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: 2,
          bgcolor: "#fff"
        }}>
          {main}
        </Box>
      </Box>
    </Box>
  );
}