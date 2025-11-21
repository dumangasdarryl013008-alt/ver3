import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeProgressIndicator from "./BadgeProgressIndicator";
import { BADGE_CATEGORIES, getBadgesByCategory } from "../../../constants/BadgeConfig";

const AchievementsPanel = ({ open, onClose, badgeStats, unlockedBadges, currentGameMode }) => {
  const [selectedCategory, setSelectedCategory] = useState(currentGameMode || "NORMAL");

  const handleTabChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const categories = [
    { value: "NORMAL", label: BADGE_CATEGORIES.NORMAL.label },
    { value: "HARD", label: BADGE_CATEGORIES.HARD.label },
    { value: "COMBO", label: BADGE_CATEGORIES.COMBO.label },
    { value: "SURVIVAL", label: BADGE_CATEGORIES.SURVIVAL.label },
    { value: "TRAINER", label: BADGE_CATEGORIES.TRAINER.label },
  ];

  const badges = getBadgesByCategory(selectedCategory);
  const unlockedCount = badges.filter((badge) => unlockedBadges.includes(badge.id)).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1e1e1e",
          color: "#ffffff",
          borderRadius: "12px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            🏆 Achievements
          </Typography>
          <Typography variant="caption" sx={{ color: "#aaa" }}>
            Track your progress and unlock badges
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

      <DialogContent>
        <Tabs
          value={selectedCategory}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            marginBottom: 3,
            "& .MuiTab-root": {
              color: "#aaa",
              fontSize: "0.75rem",
              minHeight: "auto",
              padding: "8px 12px",
            },
            "& .Mui-selected": {
              color: "#ffd700",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#ffd700",
            },
          }}
        >
          {categories.map((cat) => (
            <Tab key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Tabs>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            Total Completed Badges: <span style={{ color: "#ffd700", fontWeight: "bold" }}>{unlockedCount}</span> /{" "}
            {badges.length}
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              marginTop: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${(unlockedCount / badges.length) * 100}%`,
                height: "100%",
                backgroundColor: "#ffd700",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ maxHeight: "500px", overflowY: "auto", paddingRight: 1 }}>
          {badges.map((badge) => (
            <BadgeProgressIndicator
              key={badge.id}
              badge={badge}
              stats={badgeStats}
              unlocked={unlockedBadges.includes(badge.id)}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementsPanel;
