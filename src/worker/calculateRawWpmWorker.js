// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const { rawKeyStrokes, countDownConstant, countDown } = e.data;

  const elapsed = countDownConstant - countDown + 1;
  
  // Require minimum 2 seconds elapsed to prevent unrealistic spikes
  if (elapsed < 2) {
    postMessage(0);
    return;
  }

  const rawWpm = (rawKeyStrokes / 5 / elapsed) * 60.0;
  
  // Cap raw WPM to realistic maximum of 250 WPM (slightly higher than net WPM)
  const cappedRawWpm = Math.min(rawWpm, 250);
  const roundedRawWpm = Math.round(cappedRawWpm);

  postMessage(roundedRawWpm);
};
