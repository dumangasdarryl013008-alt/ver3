import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  GAME_MODE_HARD,
  GAME_MODE_SURVIVAL,
  GAME_MODE_COMBO,
} from "../../../constants/Constants";

const TRAINER_MODE = "Trainer";

const Leaderboard = ({ open, onClose, leaderboardData }) => {
  const [tabValue, setTabValue] = useState("overall");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFilteredData = () => {
    if (!leaderboardData || leaderboardData.length === 0) return [];
    
    if (tabValue === "overall") {
      return [...leaderboardData].sort((a, b) => b.score - a.score);
    }
    
    return leaderboardData
      .filter(entry => entry.mode === tabValue)
      .sort((a, b) => b.score - a.score);
  };

  const filteredData = getFilteredData();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={window.innerWidth < 768}
    >
      <DialogTitle>
        Leaderboards
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Overall" value="overall" />
            <Tab label="Hard" value={GAME_MODE_HARD} />
            <Tab label="Survival" value={GAME_MODE_SURVIVAL} />
            <Tab label="Combo" value={GAME_MODE_COMBO} />
            <Tab label="QWERTY" value={TRAINER_MODE} />
          </Tabs>
        </Box>
        <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Player Name</TableCell>
                <TableCell>{tabValue === TRAINER_MODE ? "LPS" : "WPM"}</TableCell>
                <TableCell>Accuracy</TableCell>
                {tabValue === TRAINER_MODE && <TableCell>Wrong Letters</TableCell>}
                {tabValue === "overall" && <TableCell>Mode</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tabValue === TRAINER_MODE ? 5 : (tabValue === "overall" ? 5 : 4)} align="center">
                    No scores yet. Play to get on the leaderboard!
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.playerName}</TableCell>
                    <TableCell>
                      {entry.score} {entry.mode === TRAINER_MODE ? "LPS" : "WPM"}
                    </TableCell>
                    <TableCell>{entry.accuracy || 0}%</TableCell>
                    {tabValue === TRAINER_MODE && <TableCell>{entry.incorrectCount || 0}</TableCell>}
                    {tabValue === "overall" && <TableCell>{entry.mode}</TableCell>}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
