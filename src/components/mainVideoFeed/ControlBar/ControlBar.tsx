import React, { useContext, useEffect, useState } from 'react';
import cn from 'classname';

import { VideoStateContext } from '@context/videoState/VideoContext';

import IconButton from '@components/iconButton/IconButton';
import Volume from '@components/volume/Volume';

import useFullScreen from '@hooks/useFullScreen/useFullScreen';

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
  const { actions } = useContext(VideoStateContext);
  const setFullScreenMode = useFullScreen();

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

  const currentTime = formatTime((player?.getCurrentTime() || 0) * 1000);

  const getBarPercentage = (event): number => {
    const { offsetWidth } = event.currentTarget;
    const rect = event.target.getBoundingClientRect();
    const x = event.pageX - rect.left;
    const barPercentage = x / offsetWidth;

    return barPercentage;
  };

  const handleBarClick = (event): void => {
    const barPercentage = getBarPercentage(event);

    player.seek(player.getDuration() * barPercentage);
  };

  if (!lastUpdate) {
    return null;
  }

  const handleVolumeChange = (e): void => {
    if (e.isMuted) {
      player.mute();
    } else {
      player.unmute();
    }

    player.setVolume(e.volume);
    setLastUpdate(new Date());
  };

  const getFullScreenIcon = (): string => {
    if (isFullScreen) {
      if (actions?.length) {
        return '/icons/squeezeback-notification.svg';
      }

      return '/icons/squeezeback.svg';
    }

    return '/icons/full-screen.svg';
  };

  const getFullScreenClassname = (): string => {
    if (isFullScreen) {
      if (actions?.length) {
        return styles.squeezeBackNotification;
      }

      return styles.squeezeBack;
    }

    return styles.fullscreen;
  };

  return (
    <div className={cn(styles.container, classname)}>
      <div className={styles.barContainer}>
        <span className={styles.currentTime}>{currentTime}</span>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,
        jsx-a11y/no-static-element-interactions */}
        <div className={styles.bar} onClick={handleBarClick}>
          <div className={styles.barContent}>
            <div
              className={styles.progress}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.leftSide}>
          <p className={styles.feedName}>{currentFeed.name}</p>
          <div className={styles.buttons}>
            <IconButton
              className={styles.iconButton}
              height={24}
              imageUrl={
                player?.isPlaying() ? '/icons/pause.svg' : '/icons/play.svg'
              }
              title="Play"
              width={24}
              onClick={handlePlayClick}
            />
            <Volume
              initialVolume={player?.getVolume()}
              onVolumeChange={handleVolumeChange}
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
            className={getFullScreenClassname()}
            height={24}
            imageUrl={getFullScreenIcon()}
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
