import React from "react";
import styled from "styled-components";

const StartScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  z-index: 1000;
`;

const GameTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 3rem;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.title};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CatFace = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
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

const StartButton = styled.button`
  font-size: 1.5rem;
  padding: 1rem 3rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.stats};
  color: ${({ theme }) => theme.background};
  font-weight: bold;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.title};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 152, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.8rem 2rem;
  }
`;

const FooterCredits = styled.div`
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textTypeBox};
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    bottom: 10px;
  }
`;

const StartScreen = ({ onStartGame }) => {
  return (
    <StartScreenContainer>
      {/* Floating cat paw decorations */}
      <div className="floating-cat-paws">
        {[
          { top: '5%', left: '2%', size: 55, rotate: -20, opacity: 0.13 },
          { top: '8%', right: '3%', size: 48, rotate: 35, opacity: 0.11 },
          { top: '18%', left: '7%', size: 52, rotate: -15, opacity: 0.12 },
          { top: '22%', right: '12%', size: 50, rotate: 25, opacity: 0.10 },
          { top: '32%', left: '5%', size: 46, rotate: 18, opacity: 0.11 },
          { top: '38%', right: '8%', size: 54, rotate: -28, opacity: 0.12 },
          { top: '48%', left: '10%', size: 49, rotate: 32, opacity: 0.10 },
          { top: '52%', right: '15%', size: 51, rotate: -12, opacity: 0.11 },
          { top: '62%', left: '4%', size: 47, rotate: 22, opacity: 0.09 },
          { top: '68%', right: '6%', size: 53, rotate: -25, opacity: 0.12 },
          { top: '78%', left: '8%', size: 50, rotate: 15, opacity: 0.10 },
          { top: '82%', right: '10%', size: 48, rotate: -18, opacity: 0.11 },
          { bottom: '8%', left: '12%', size: 52, rotate: 28, opacity: 0.11 },
          { bottom: '12%', right: '14%', size: 49, rotate: -22, opacity: 0.10 },
          { top: '42%', left: '18%', size: 45, rotate: -8, opacity: 0.09 },
        ].map((paw, index) => (
          <div 
            key={index}
            className="cat-paw" 
            style={{ 
              position: 'absolute', 
              ...paw, 
              transform: `rotate(${paw.rotate}deg)`,
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            <svg width={paw.size} height={paw.size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 3px 6px rgba(255, 152, 0, 0.3))' }}>
              <ellipse cx="50" cy="70" rx="18" ry="22" fill="#FF9800" opacity="0.85"/>
              <ellipse cx="50" cy="68" rx="14" ry="18" fill="#FFB74D" opacity="0.6"/>
              
              <ellipse cx="28" cy="42" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
              <ellipse cx="28" cy="41" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
              
              <ellipse cx="42" cy="32" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
              <ellipse cx="42" cy="31" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
              
              <ellipse cx="58" cy="32" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
              <ellipse cx="58" cy="31" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
              
              <ellipse cx="72" cy="42" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
              <ellipse cx="72" cy="41" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <GameTitle>
          TypeBlast <CatFace />
        </GameTitle>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <StartButton onClick={onStartGame}>
            Start Game
          </StartButton>
        </div>
      </div>

      {/* Footer credits */}
      <FooterCredits>
        Project from 12-Peter, Group 5. School Year 2025–2026.
      </FooterCredits>
    </StartScreenContainer>
  );
};

export default StartScreen;
