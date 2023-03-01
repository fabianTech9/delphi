import { useContext } from 'react';

import { VideoContext } from '@context/video/VideoContext';

function useBitmovinConfig(muted = true): any {
  const { config } = useContext(VideoContext);

  const playerConfig = {
    ...config,
    ui: false,
    cast: {
      enable: true,
    },
    playback: {
      muted,
    },
    adaptation: {
      limitToPlayerSize: true,
    },
  };

  return playerConfig;
}

export default useBitmovinConfig;
