import React, { useEffect, useRef } from 'react';

import styles from './Player.module.scss';

function Player(): JSX.Element {
  const playerDiv = useRef(null);
  const token =
    'DIGEST:eyJhcHBsaWNhdGlvbklkIjoiZGVtbyIsImRpZ2VzdCI6IkI5Y3hYN0xnUjBBamtvSlo5Nm5xb1FQMUg3enNhc2o5RElTT2piRDZTdytaOGhHUm5VUDB1eTBWQjUzQ1lMdEpWTTA4TlZUcVlpVnZmcjk4d3M2MjJBPT0iLCJ0b2tlbiI6IntcImV4cGlyZXNcIjoxOTY0MDE5MzM3MTM1LFwidXJpXCI6XCJodHRwczovL3BjYXN0LnBoZW5peHJ0cy5jb21cIixcInJlcXVpcmVkVGFnXCI6XCJjaGFubmVsSWQ6dXMtbm9ydGhlYXN0I2RlbW8jcGhlbml4V2Vic2l0ZURlbW9cIn0ifQ==';

  useEffect(() => {
    // @ts-ignore
    window.phenix.Channels.createChannel({
      videoElement: playerDiv.current,
      token,
    });
  }, []);

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
