import { useEffect, useRef } from 'react';

const useGameOverSound = (shouldPlay) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/gameover.mp3');
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (shouldPlay && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log('Game over sound playback failed:', error);
      });
    }
  }, [shouldPlay]);

  return audioRef;
};

export default useGameOverSound;
