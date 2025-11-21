const createMeowSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const playMeow = () => {
    const currentTime = audioContext.currentTime;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, currentTime);
    filter.frequency.exponentialRampToValueAtTime(600, currentTime + 0.05);
    filter.Q.value = 10;
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + 0.02);
    oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + 0.08);
    
    gainNode.gain.setValueAtTime(0.3, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.1, currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.12);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.12);
  };
  
  return playMeow;
};

export default createMeowSound;
