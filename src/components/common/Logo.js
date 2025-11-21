import React from "react";
import { Box, TextField } from "@mui/material";

const CatFace = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.9"/>
    <polygon points="10,12 14,4 18,12" fill="currentColor"/>
    <polygon points="30,12 34,4 38,12" fill="currentColor"/>
    <circle cx="17" cy="22" r="2.5" fill="#333"/>
    <circle cx="31" cy="22" r="2.5" fill="#333"/>
    <path d="M 24 26 Q 20 29 18 28 M 24 26 Q 28 29 30 28" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="24" cy="26" r="1.5" fill="#333"/>
    <line x1="10" y1="24" x2="2" y2="24" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10" y1="28" x2="2" y2="30" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10" y1="20" x2="2" y2="18" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="38" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="38" y1="28" x2="46" y2="30" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="38" y1="20" x2="46" y2="18" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const Logo = ({ isFocusedMode, playerName, setPlayerName }) => {

  return (
    <div className="header" style={{visibility: isFocusedMode ? 'hidden' : 'visible' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box>
          <h1>
            TypeBlast <CatFace />
          </h1>
          <span className="sub-header">
            Ready to type? Practice your typing skills with style!
          </span>
        </Box>
        <Box>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            sx={{
              input: { color: 'inherit' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'currentColor',
                },
                '&:hover fieldset': {
                  borderColor: 'currentColor',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'currentColor',
                },
              },
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Logo;
