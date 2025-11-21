import React, { useEffect, useRef, useState, useCallback } from 'react';

const BackgroundMusic = ({ isPlaying }) => {
  const audioRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Try to play the music
  const tryPlayMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    audio.play()
      .then(() => {
        setHasStarted(true);
        setAutoplayBlocked(false);
      })
      .catch(error => {
        console.log('Auto-play prevented by browser, waiting for user interaction:', error);
        setAutoplayBlocked(true);
      });
  }, [isPlaying]);

  // Handle user interaction to start music
  const handleUserInteraction = useCallback(() => {
    if (autoplayBlocked && isPlaying && !hasStarted) {
      tryPlayMusic();
    }
  }, [autoplayBlocked, isPlaying, hasStarted, tryPlayMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;

    if (isPlaying) {
      // Try to play immediately
      tryPlayMusic();
    } else {
      audio.pause();
      setHasStarted(false);
    }
  }, [isPlaying, tryPlayMusic]);

  // Set up event listeners for user interaction
  useEffect(() => {
    if (!autoplayBlocked || hasStarted || !isPlaying) return;

    // Listen for various user interactions
    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    
    // Don't use { once: true } - allow multiple attempts until music starts
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction);
    });

    // Cleanup listeners when music starts or component unmounts
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [autoplayBlocked, hasStarted, isPlaying, handleUserInteraction]);

  return (
    <audio
      ref={audioRef}
      src="/typeblast-bgm.mp3"
      loop
      autoPlay
      style={{ display: 'none' }}
    />
  );
};

export default BackgroundMusic;
