import React from "react";
import MusicPlayer from "./MusicPlayer";

const MusicPlayerSnackbar = ({isMusicMode, isFocusedMode, onMouseLeave }) => {

  return (
    <div>
      <MusicPlayer
        disabled={!isMusicMode}
        isZenMode={isFocusedMode}
      ></MusicPlayer>
    </div>
  );
};

export default MusicPlayerSnackbar;