import React, { useEffect, useState } from "react";
import { Box, Typography, Slide } from "@mui/material";
import "../../../style/badge-notification.css";

const BadgeNotification = ({ badge, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!badge) return null;

  return (
    <Slide direction="left" in={show} mountOnEnter unmountOnExit>
      <Box
        className="badge-notification"
        sx={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          backgroundColor: "#1e1e1e",
          border: "2px solid #ffd700",
          borderRadius: "12px",
          padding: "16px 24px",
          boxShadow: "0 8px 32px rgba(255, 215, 0, 0.3)",
          maxWidth: "350px",
          animation: "pulse 0.5s ease-in-out",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h2" sx={{ fontSize: "2rem" }}>
            🎉
          </Typography>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#ffd700",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              Congratulations!
            </Typography>
            <Typography variant="body1" sx={{ color: "#ffffff" }}>
              You earned <span style={{ fontWeight: "bold" }}>{badge.tier} {badge.name}</span>!
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#aaaaaa", marginTop: "4px", display: "block" }}
            >
              {badge.description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default BadgeNotification;
