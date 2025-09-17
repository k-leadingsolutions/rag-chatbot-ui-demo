import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { toggleFavorite } from "../api/storage";

export default function FavoriteButton({ sessionId, initialFavorite, onChange }) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const { data } = await toggleFavorite(sessionId);
      setFavorite(data.favorite);
      if (onChange) onChange();
    } catch (e) {
      alert("Failed to toggle favorite");
    }
    setLoading(false);
  };

  return (
    <Tooltip title={favorite ? "Unmark Favourite" : "Mark as Favourite"}>
      <span>
        <IconButton
          color={favorite ? "secondary" : "default"}
          size="small"
          onClick={handleToggle}
          disabled={loading}
        >
          {favorite ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );
}