import React, { useEffect, useState } from "react";
import { Tooltip, Button } from "@mui/material";
import { CHAR_TOOLTIP_TITLE } from "../../../constants/Constants";
import "../../../style/timer-animation.css";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as TooltipChart,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";
import { red } from "@mui/material/colors";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useGameOverSound from "../../../hooks/useGameOverSound";

const Stats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  language,
  rawKeyStrokes,
  theme,
  renderResetButton,
  setIncorrectCharsCount,
  incorrectCharsCount,
  onReset,
  onBack,
}) => {
  const [roundedRawWpm, setRoundedRawWpm] = useState(0);
  const roundedWpm = Math.round(wpm);
  
  useGameOverSound(status === "finished");

  useEffect(() => {
    const worker = new Worker(
      new URL("../../../worker/calculateRawWpmWorker", import.meta.url)
    );

    worker.postMessage({ rawKeyStrokes, countDownConstant, countDown });

    worker.onmessage = function (e) {
      setRoundedRawWpm(e.data);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [rawKeyStrokes, countDownConstant, countDown]);

  const initialTypingTestHistory = [
    {
      wpm: 0,
      rawWpm: 0,
      time: 0,
      error: 0,
    },
  ];

  const [typingTestHistory, setTypingTestHistory] = useState(
    initialTypingTestHistory
  );

  const accuracy = Math.round(statsCharCount[0]);

  const data = typingTestHistory.map((history) => ({
    wpm: history.wpm,
    rawWpm: history.rawWpm,
    time: history.time,
    error: history.error,
  }));

  useEffect(() => {
    if (status === "started") {
      setTypingTestHistory(initialTypingTestHistory);
    }
  }, [status]);

  useEffect(() => {
    if (status === "started" && countDown < countDownConstant) {
      const worker = new Worker(
        new URL("../../../worker/trackHistoryWorker", import.meta.url)
      );

      worker.postMessage({
        countDown,
        countDownConstant,
        typingTestHistory,
        roundedWpm,
        roundedRawWpm,
        incorrectCharsCount,
      });

      worker.onmessage = function (e) {
        const { newEntry, resetErrors } = e.data;
        setTypingTestHistory((prevTypingTestHistory) => [
          ...prevTypingTestHistory,
          newEntry,
        ]);

        if (resetErrors) {
          setIncorrectCharsCount(0);
        }
      };

      // Clean up the worker on component unmount
      return () => worker.terminate();
    }
  }, [countDown]);

  const getFormattedLanguageLanguageName = (value) => {
    switch (value) {
      case "ENGLISH_MODE":
        return "eng";
      case "TAGALOG_MODE":
        return "tgl";
      default:
        return "eng";
    }
  };

  const renderCharStats = () => (
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>{CHAR_TOOLTIP_TITLE}</span>
      }
    >
      <div>
        <p className="stats-title">Characters</p>
        <h2 className="stats-value">
          <span className="correct-char-stats">{statsCharCount[1]}</span>/
          <span className="incorrect-char-stats">{statsCharCount[2]}</span>/
          <span className="missing-char-stats">{statsCharCount[3]}</span>/
          <span className="correct-char-stats">{statsCharCount[4]}</span>/
          <span className="incorrect-char-stats">{statsCharCount[5]}</span>
        </h2>
      </div>
    </Tooltip>
  );

  const renderIndicator = (color) => (
    <span
      style={{ backgroundColor: color, height: "12px", width: "24px" }}
    ></span>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0].payload;
      return (
        <div
          className="custom-tooltip"
          style={{
            paddingInline: "8px",
            paddingBlock: "2px",
          }}
        >
          <p className="label" style={{ fontSize: "12px", fontWeight: "bold" }}>
            {`Time: ${label} s`}
          </p>
          <p className="desc tooltip">
            {renderIndicator(red[400])}
            {`Errors: ${payloadData.error}`}
          </p>
          <p className="desc tooltip">
            {renderIndicator(theme.textTypeBox)}
            {`Raw WPM: ${payloadData.rawWpm}`}
          </p>
          <p className="desc tooltip">
            {renderIndicator(theme.text)}
            {`WPM: ${payloadData.wpm}`}
          </p>
        </div>
      );
    }

    return null;
  };

  const renderAccuracy = () => (
    <div style={{ marginTop: "16px" }}>
      <h2 className="primary-stats-title">ACC</h2>
      <h1 className="primary-stats-value">{accuracy}%</h1>
    </div>
  );

  const renderRawKpm = () => (
    <div>
      <p className="stats-title">KPM</p>
      <h2 className="stats-value">
        {Math.round((rawKeyStrokes / Math.max(countDownConstant, 1)) * 60.0)}
      </h2>
    </div>
  );

  const renderLanguage = () => (
    <div>
      <p className="stats-title">Test Mode</p>
      <h2 className="stats-value">
        {getFormattedLanguageLanguageName(language)}
      </h2>
    </div>
  );

  const renderTime = () => (
    <div>
      <p className="stats-title">Time</p>
      <h2 className="stats-value">{countDownConstant} s</h2>
    </div>
  );

  const renderWpm = () => {
    const totalWpm = data.map((e) => e.wpm).reduce((a, b) => a + b, 0);
    const averageWpm = data.length > 1 ? totalWpm / (data.length - 1) : 0;
    return (
      <div>
        <h2 className="primary-stats-title">WPM</h2>
        <h1 className="primary-stats-value">{Math.round(averageWpm)}</h1>
      </div>
    );
  };

  const Chart = () => (
    <ResponsiveContainer
      width="100%"
      minHeight={200}
      maxHeight={200}
      height="100%"
    >
      <ComposedChart
        width="100%"
        height="100%"
        data={data.filter((d) => d.time !== 0)}
        margin={{
          top: 12,
          right: 12,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          vertical={false}
          horizontal={false}
          stroke={theme.text}
          opacity={0.15}
        />
        <XAxis
          dataKey="time"
          stroke={theme.text}
          tickMargin={10}
          opacity={0.25}
        />
        <YAxis stroke={theme.text} tickMargin={10} opacity={0.25} />
        <TooltipChart cursor content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="rawWpm"
          stroke={theme.textTypeBox}
          dot={false}
          activeDot={false}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke={theme.text}
          dot={false}
          activeDot={false}
        />
        <Bar dataKey="error" barSize={12} fill={`${red[400]}`} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <>
      {status !== "finished" && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Tooltip title="Restart Test">
            <div 
              onClick={onReset}
              style={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" style={{ opacity: 0.9 }}>
                {/* Head */}
                <circle cx="25" cy="25" r="14" fill="#FF9800"/>
                <circle cx="25" cy="25" r="14" fill="url(#catGradient)"/>
                
                {/* Gradient definition */}
                <defs>
                  <radialGradient id="catGradient" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#FFB74D"/>
                    <stop offset="100%" stopColor="#FF9800"/>
                  </radialGradient>
                </defs>
                
                {/* Left ear */}
                <path d="M 12 16 Q 9 9 14 12 L 16 16 Z" fill="#FF9800"/>
                <path d="M 13 15 Q 11 11 14 13 L 15 15 Z" fill="#FFE0B2"/>
                
                {/* Right ear */}
                <path d="M 38 16 Q 41 9 36 12 L 34 16 Z" fill="#FF9800"/>
                <path d="M 37 15 Q 39 11 36 13 L 35 15 Z" fill="#FFE0B2"/>
                
                {/* Eyes with shine */}
                <ellipse cx="19" cy="24" rx="2.5" ry="3" fill="#333"/>
                <ellipse cx="31" cy="24" rx="2.5" ry="3" fill="#333"/>
                <circle cx="19.5" cy="23" r="0.8" fill="#FFF"/>
                <circle cx="31.5" cy="23" r="0.8" fill="#FFF"/>
                
                {/* Cute nose */}
                <path d="M 25 28 L 23 30 Q 25 31 27 30 Z" fill="#F06292"/>
                
                {/* Whiskers left */}
                <line x1="11" y1="25" x2="16" y2="24" stroke="#333" strokeWidth="0.5"/>
                <line x1="11" y1="27" x2="16" y2="27" stroke="#333" strokeWidth="0.5"/>
                <line x1="11" y1="29" x2="16" y2="30" stroke="#333" strokeWidth="0.5"/>
                
                {/* Whiskers right */}
                <line x1="39" y1="25" x2="34" y2="24" stroke="#333" strokeWidth="0.5"/>
                <line x1="39" y1="27" x2="34" y2="27" stroke="#333" strokeWidth="0.5"/>
                <line x1="39" y1="29" x2="34" y2="30" stroke="#333" strokeWidth="0.5"/>
                
                {/* Cute smile */}
                <path d="M 20 31 Q 25 34 30 31" stroke="#333" strokeWidth="1" fill="none"/>
                
                {/* Blush */}
                <ellipse cx="16" cy="28" rx="2" ry="1.5" fill="#FF6B6B" opacity="0.3"/>
                <ellipse cx="34" cy="28" rx="2" ry="1.5" fill="#FF6B6B" opacity="0.3"/>
                
                {/* Cute bow on head */}
                <ellipse cx="22" cy="13" rx="3" ry="2" fill="#F06292"/>
                <ellipse cx="28" cy="13" rx="3" ry="2" fill="#F06292"/>
                <circle cx="25" cy="13" r="1.5" fill="#F06292"/>
              </svg>
              <RestartAltIcon 
                sx={{ 
                  position: 'absolute',
                  fontSize: '20px', 
                  color: '#fff',
                  opacity: 0.9
                }} 
              />
            </div>
          </Tooltip>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 className={status === "started" ? (countDown < 10 ? "timer-warning" : "timer-countdown") : ""}>
              {countDown} s
            </h3>
            <h3>WPM: {Math.round(wpm)}</h3>
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="stats-overlay">
          <section className="stats-chart">
            <section className="stats-header">
              <div>
                {renderWpm()}
                {renderAccuracy()}
              </div>
              {Chart()}
            </section>
            <section style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RestartAltIcon />}
                  onClick={onReset}
                  className="cat-button"
                  sx={{
                    backgroundColor: '#FF9800',
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    padding: '12px 48px',
                    borderRadius: '20px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F57C00',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Try Again
                </Button>
              </div>
              <div style={{ opacity: 0.5, fontSize: '14px' }}>
                {renderResetButton()}
              </div>
            </section>
            <section className="stats-footer">
              {renderLanguage()}
              {renderRawKpm()}
              {renderCharStats()}
              {renderTime()}
            </section>
          </section>
        </div>
      )}
    </>
  );
};

export default Stats;
