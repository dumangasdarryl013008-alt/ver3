// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const { wpmKeyStrokes, countDownConstant, countDown } = e.data;

  const elapsed = countDownConstant - countDown + 1;
  
  // Require minimum 2 seconds elapsed to prevent unrealistic spikes
  if (elapsed < 2) {
    postMessage(0);
    return;
  }

  // Calculate WPM: keystrokes / 5 (avg word length) / time in minutes
  const currWpm = wpmKeyStrokes / 5 / elapsed * 60.0;
  
  // Cap WPM to realistic maximum of 200 WPM to prevent cheating
  const cappedWpm = Math.min(currWpm, 200);

  postMessage(cappedWpm);
};
