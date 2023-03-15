import React, { useEffect, useState } from 'react';
import cn from 'classname';

import IconButton from '@components/iconButton/IconButton';

import useFullScreen from '@hooks/useFullScreen/useFullScreen';

import styles from './ControlBar.module.scss';

function ControlBar({
  player,
  containerRef,
  currentFeed,
  classname,
}: any): JSX.Element {
  const [initialTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [percentage, setPercentage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const setFullScreenMode = useFullScreen();

  useEffect(() => {
    let value = 0;
    setInterval(() => {
      const newPercentage = 100 * (value / (value + 100));

      setPercentage(newPercentage);
      value += 0.1;
    }, 300);
  }, []);

  useEffect(() => {
    if (containerRef) {
      containerRef.addEventListener('fullscreenchange', () => {
        setIsFullScreen(!!document.fullscreenElement);
      });
    }
  }, [containerRef]);
  const handlePlayClick = (): void => {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
    setLastUpdate(new Date());
  };

  const handleVolumeClick = (): void => {
    player.muted = !player.muted;
    setLastUpdate(new Date());
  };

  const handleFullscreenClick = (): void => {
    setFullScreenMode(containerRef, isFullScreen);
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

  const currentTimeMilliseconds = Number(new Date()) - Number(initialTime);
  const currentTime = formatTime(currentTimeMilliseconds);

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
          {currentFeed.name && (
            <p className={styles.feedName}>{currentFeed.name}</p>
          )}
          <div className={styles.buttons}>
            <IconButton
              height={24}
              imageUrl={player?.paused ? '/icons/play.svg' : '/icons/pause.svg'}
              title="Play"
              width={24}
              onClick={handlePlayClick}
            />
            <IconButton
              height={24}
              imageUrl={
                player?.muted
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
