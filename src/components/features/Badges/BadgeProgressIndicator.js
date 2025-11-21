import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const BadgeProgressIndicator = ({ badge, stats, unlocked }) => {
  if (!badge) return null;

  const progress = badge.getProgress(stats);
  const percentage = Math.min(100, Math.round(progress.percentage));
  const isNearCompletion = percentage >= 80 && percentage < 100;

  const getProgressColor = () => {
    if (unlocked) return "#4caf50";
    if (isNearCompletion) return "#ffd700";
    return "#2196f3";
  };

  const getProgressBar = () => {
    const filledBlocks = Math.floor(percentage / 10);
    const emptyBlocks = 10 - filledBlocks;
    return "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
  };

  return (
    <Box
      sx={{
        marginBottom: 2,
        padding: 2,
        backgroundColor: unlocked ? "rgba(76, 175, 80, 0.1)" : "rgba(33, 150, 243, 0.05)",
        borderRadius: "8px",
        border: unlocked ? "1px solid #4caf50" : isNearCompletion ? "1px solid #ffd700" : "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1, gap: 1 }}>
        <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>
          {badge.tier}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", flex: 1 }}>
          {badge.name}
        </Typography>
        {unlocked && (
          <Typography sx={{ color: "#4caf50", fontWeight: "bold" }}>
            ✓ Unlocked
          </Typography>
        )}
      </Box>

      <Typography variant="caption" sx={{ color: "#aaa", display: "block", marginBottom: 1 }}>
        {badge.description}
      </Typography>

      <Box sx={{ marginBottom: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            color: getProgressColor(),
            letterSpacing: "1px",
          }}
        >
          [{getProgressBar()}] {percentage}%
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" sx={{ color: getProgressColor(), fontWeight: "bold" }}>
          {progress.current}/{progress.target}
        </Typography>
        
        {isNearCompletion && !unlocked && (
          <Typography
            variant="caption"
            sx={{
              color: "#ffd700",
              fontWeight: "bold",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            Almost there! 🔥
          </Typography>
        )}
      </Box>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          marginTop: 1,
          height: 6,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: getProgressColor(),
            borderRadius: 3,
          },
        }}
      />
    </Box>
  );
};

export default BadgeProgressIndicator;
