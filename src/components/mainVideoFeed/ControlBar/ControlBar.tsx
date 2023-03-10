import React, { useEffect, useState } from 'react';
import cn from 'classname';

import IconButton from '@components/iconButton/IconButton';

import styles from './ControlBar.module.scss';

function ControlBar({
  player,
  containerRef,
  currentFeed,
  classname,
}: any): JSX.Element {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [percentage, setPercentage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setInterval(() => {
      if (player) {
        const newPercentage =
          100 * (player.getCurrentTime() / player.getDuration());

        setPercentage(newPercentage);
      }
    }, 300);
  }, [player]);

  useEffect(() => {
    if (containerRef) {
      containerRef.addEventListener('fullscreenchange', () => {
        setIsFullScreen(!!document.fullscreenElement);
      });
    }
  }, [containerRef]);
  const handlePlayClick = (): void => {
    if (player.isPlaying()) {
      player.pause();
    } else {
      player.play();
    }
    setLastUpdate(new Date());
  };

  const handleVolumeClick = (): void => {
    if (player.isMuted()) {
      player.unmute();
    } else {
      player.mute();
    }
    setLastUpdate(new Date());
  };

  const handleFullscreenClick = (): void => {
    if (!isFullScreen && containerRef?.requestFullscreen) {
      containerRef.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setLastUpdate(new Date());
  };

  const formatTime = (milliseconds): string => {
    const seconds = milliseconds / 1000;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);

    return [h, m > 9 ? m : `0${m}` || '00', s > 9 ? s : `0${s}`]
      .filter(Boolean)
      .join(':');
  };

  const currentTime = formatTime((player?.getCurrentTime() || 0) * 1000);

  if (!lastUpdate) {
    return null;
  }

  return (
    <div className={cn(styles.container, classname)}>
      <div className={styles.barContainer}>
        <span className={styles.currentTime}>{currentTime}</span>
        <div className={styles.bar}>
          <div
            className={styles.progress}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.leftSide}>
          <p className={styles.feedName}>{currentFeed.name}</p>
          <div className={styles.buttons}>
            <IconButton
              height={24}
              imageUrl={
                player?.isPlaying() ? '/icons/pause.svg' : '/icons/play.svg'
              }
              title="Play"
              width={24}
              onClick={handlePlayClick}
            />
            <IconButton
              height={24}
              imageUrl={
                player?.isMuted()
                  ? '/icons/volume-mute.svg'
                  : '/icons/volume-100.svg'
              }
              title="Volume"
              width={24}
              onClick={handleVolumeClick}
            />
          </div>
        </div>
        <div className={styles.buttons}>
          {currentFeed.subtitles && (
            <IconButton
              className={styles.subtitles}
              height={24}
              imageUrl="/icons/subtitles.svg"
              title="subtitles"
              width={24}
            />
          )}
          <IconButton
            height={24}
            imageUrl="/icons/cast.svg"
            title="Cast"
            width={24}
          />
          <IconButton
            className={isFullScreen ? styles.squeezeBack : styles.fullscreen}
            height={24}
            imageUrl={
              isFullScreen ? '/icons/squeezeback.svg' : '/icons/full-screen.svg'
            }
            title="Fullscreen"
            width={24}
            onClick={handleFullscreenClick}
          />
        </div>
      </div>
    </div>
  );
}

export default ControlBar;
