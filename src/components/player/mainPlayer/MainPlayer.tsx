import React, { useEffect, useRef, useState } from 'react';
import cn from 'classname';

import IconButton from '@components/iconButton/IconButton';
import Description from '@components/mainVideoFeed/description/Description';
import ControlBar from '@components/player/ControlBar/ControlBar';

import styles from './MainPlayer.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function MainPlayer({ currentVideo, currentFeed, overlay }: any): JSX.Element {
  const playerDiv = useRef(null);
  const containerDiv = useRef(null);

  const { streamToken } = currentFeed;
  const [showControls, setShowControls] = useState(false);
  const [hideControlsTimer, setHideControlsTimer] = useState();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!streamToken) {
      return;
    }
    // @ts-ignore
    window.phenix.Channels.createChannel({
      videoElement: playerDiv.current,
      token: streamToken,
    });
  }, [streamToken]);

  const handleMouseAction = (): void => {
    if (hideControlsTimer) {
      clearTimeout(hideControlsTimer);
    }

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 2000);

    // @ts-ignore
    setHideControlsTimer(timer);
    setShowControls(true);
  };

  useEffect(() => {
    if (containerDiv.current) {
      containerDiv.current.addEventListener('fullscreenchange', () => {
        setIsFullScreen(!!document.fullscreenElement);
      });
    }
  }, [playerDiv.current]);

  const handlePause = (): void => {
    setIsPaused(true);
  };

  const handlePlay = (): void => {
    setIsPaused(false);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cn(styles.playerWrapper, {
        [styles.showControls]: showControls,
        [styles.canCast]: currentVideo.isCastingEnabled,
      })}
      ref={containerDiv}
      onMouseDown={handleMouseAction}
      onMouseMove={handleMouseAction}
    >
      <video
        autoPlay
        playsInline
        className={styles.player}
        id="myVideoId"
        ref={playerDiv}
        onPause={handlePause}
        onPlay={handlePlay}
      />

      <img
        alt="overlay"
        className={cn(styles.overlay, { [styles.isPaused]: isPaused })}
        src={overlay}
      />

      <div
        className={cn(styles.controlBar, {
          [styles.isFullScreen]: isFullScreen,
        })}
      >
        <IconButton
          className={styles.back}
          height={50}
          imageUrl="/icons/arrow.svg"
          title="back"
          width={50}
        />
        <Description video={currentVideo} />
        <ControlBar
          classname={styles.controls}
          containerRef={containerDiv.current}
          currentFeed={currentFeed}
          player={playerDiv.current}
        />
      </div>
    </div>
  );
}

export default MainPlayer;
