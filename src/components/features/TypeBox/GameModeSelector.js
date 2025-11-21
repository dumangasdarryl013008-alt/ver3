import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import {
  GAME_MODE_NORMAL,
  GAME_MODE_HARD,
  GAME_MODE_SURVIVAL,
  GAME_MODE_COMBO,
} from "../../../constants/Constants";

const PawIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    fill="none" 
    style={{ opacity: 0.5 }}
  >
    <ellipse cx="12" cy="16" rx="5" ry="4" fill="#FF9800" />
    <ellipse cx="8" cy="10" rx="2" ry="2.5" fill="#FF9800" />
    <ellipse cx="16" cy="10" rx="2" ry="2.5" fill="#FF9800" />
    <ellipse cx="6" cy="13" rx="1.5" ry="2" fill="#FF9800" />
    <ellipse cx="18" cy="13" rx="1.5" ry="2" fill="#FF9800" />
  </svg>
);

const GameModeSelector = ({ gameMode, setGameMode, disabled }) => {
  const modes = [
    {
      value: GAME_MODE_NORMAL,
      label: "Normal",
      tooltip: "Standard typing mode",
    },
    {
      value: GAME_MODE_HARD,
      label: "Hard",
      tooltip: "-1 second for every wrong type",
    },
    {
      value: GAME_MODE_SURVIVAL,
      label: "Survival",
      tooltip: "-2s per wrong word, +1s per correct word",
    },
    {
      value: GAME_MODE_COMBO,
      label: "Combo",
      tooltip: "+3s for 2 consecutive correct words, -1s for wrong word",
    },
  ];

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
      {modes.map((mode, index) => (
        <React.Fragment key={mode.value}>
          {mode.value === GAME_MODE_NORMAL && <PawIcon />}
          <Tooltip title={mode.tooltip}>
            <Button
              size="small"
              variant={gameMode === mode.value ? "contained" : "outlined"}
              onClick={() => setGameMode(mode.value)}
              disabled={disabled}
              sx={{
                minWidth: "70px",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                padding: { xs: "4px 8px", sm: "6px 16px" },
              }}
            >
              {mode.label}
            </Button>
          </Tooltip>
          {mode.value === GAME_MODE_COMBO && <PawIcon />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default GameModeSelector;
