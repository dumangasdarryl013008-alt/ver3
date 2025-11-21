import React from "react";
import { Box } from "@mui/material";
import "./TimeAnimation.css";

const TimeAnimation = ({ animations }) => {
  if (!animations || animations.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {animations.map((animation, index) => {
        const color = animation.type === 'bonus' ? '#4CAF50' : '#F44336';
        const text = animation.type === 'bonus' ? `+${animation.value}s` : `-${animation.value}s`;
        
        return (
          <Box
            key={animation.id}
            className="time-animation-item"
            sx={{
              color: color,
              fontSize: '2rem',
              fontWeight: 'bold',
              animation: 'slideInOut 1s ease-in-out',
              textShadow: '0 0 10px currentColor',
            }}
          >
            {text}
          </Box>
        );
      })}
    </Box>
  );
};

export default TimeAnimation;
