import React, { useContext, useEffect, useRef } from 'react';

import { VideoContext } from '../../context/video/VideoContext';

import styles from './Player.module.scss';

function Player(): JSX.Element {
  const { token } = useContext(VideoContext);
  const playerDiv = useRef(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    // @ts-ignore
    window.phenix.Channels.createChannel({
      videoElement: playerDiv.current,
      token,
    });
  }, [token]);

  return (
    <video
      autoPlay
      controls
      muted
      playsInline
      className={styles.player}
      id="myVideoId"
      ref={playerDiv}
    />
  );
}

export default Player;
