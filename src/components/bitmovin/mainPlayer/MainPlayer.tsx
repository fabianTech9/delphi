import React, { useContext, useEffect, useRef, useState } from 'react';
import { Player, PlayerEvent } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import cn from 'classname';

import { VideoStateContext } from '@context/videoState/VideoContext';

import ControlBar from '@components/bitmovin/ControlBar/ControlBar';
import Description from '@components/bitmovin/description/Description';
import IconButton from '@components/iconButton/IconButton';

import useBitmovinConfig from '@hooks/useBitmovinConfig/useBitmovinConfig';

import styles from './MainPlayer.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function MainPlayer({
  currentVideo,
  currentFeed,
  eventState$,
  eventVideoProgress$,
  userId,
  onFinish,
  children,
}: any): JSX.Element {
  const playerConfig = useBitmovinConfig(false);
  const playerDiv = useRef(null);
  const containerDiv = useRef(null);
  const [player, setPlayer] = useState(null);
  const { actions } = useContext(VideoStateContext);
  const [showControls, setShowControls] = useState(false);
  const [hideControlsTimer, setHideControlsTimer] = useState();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const addSubtitles = (playerInstance, subtitles): void => {
    if (!subtitles || !subtitles.length) {
      return;
    }

    subtitles.forEach((subtitle, index) => {
      subtitle.id = `sub${index}`;
      subtitle.kind = 'subtitle';

      playerInstance.subtitles.add(subtitle);
    });
  };

  const loadVideo = async (playerInstance, video): Promise<void> => {
    if (!video) {
      return;
    }
    const {
      hls,
      title,
      videoId,
      cdnProvider,
      customData1,
      customData2,
      customData3,
      customData4,
      customData5,
    } = video;
    await playerInstance.load({
      hls,
      analytics: {
        title,
        videoId,
        cdnProvider,
        userId,
        customData1,
        customData2,
        customData3,
        customData4,
        customData5,
      },
    });
    addSubtitles(playerInstance, video.subtitles);
  };

  useEffect(() => {
    const setupPlayer = async (): Promise<void> => {
      const playerInstance = new Player(playerDiv.current, playerConfig);

      UIFactory.buildDefaultUI(playerInstance);

      playerInstance.on(PlayerEvent.Ready, () => {
        eventState$.emit({
          state: 'Ready',
          time: playerInstance.getCurrentTime(),
        });
      });

      playerInstance.on(PlayerEvent.Paused, () => {
        eventState$.emit({
          state: 'Paused',
          time: playerInstance.getCurrentTime(),
        });
      });

      playerInstance.on(PlayerEvent.Playing, () => {
        eventState$.emit({
          state: 'Playing',
          time: playerInstance.getCurrentTime(),
        });
      });

      playerInstance.on(PlayerEvent.Seek, () => {
        eventState$.emit({
          state: 'Seek',
          time: playerInstance.getCurrentTime(),
        });
      });

      playerInstance.on(PlayerEvent.Seeked, () => {
        eventState$.emit({
          state: 'Seek',
          time: playerInstance.getCurrentTime(),
        });
      });

      playerInstance.on(PlayerEvent.PlaybackFinished, () => {
        if (onFinish) {
          onFinish();
        }
      });

      setInterval(() => {
        const currentTime = playerInstance.getCurrentTime();

        if (eventVideoProgress$) {
          eventVideoProgress$.emit(currentTime);
        }
      }, 300);

      await loadVideo(playerInstance, currentFeed);
      setPlayer(playerInstance);
    };

    setupPlayer();

    return () => {
      const destroyPlayer = (): void => {
        if (player != null) {
          player.destroy();
          setPlayer(null);
        }
      };

      destroyPlayer();
    };
  }, []);

  const handleMouseMove = (): void => {
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
  }, []);

  return (
    <div
      className={cn(styles.playerWrapper, {
        [styles.showControls]: showControls,
        [styles.canCast]: currentVideo.isCastingEnabled,
      })}
      ref={containerDiv}
      onMouseMove={handleMouseMove}
    >
      <div className="player" ref={playerDiv} />

      <div className={styles.controlBar}>
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
          player={player}
        />
      </div>
      {!!actions?.length && isFullScreen && (
        <IconButton
          className={styles.squeezeback}
          height={24}
          imageUrl="/icons/squeezeback-notification.svg"
          title="Fullscreen"
          width={24}
        />
      )}
      {children}
    </div>
  );
}

export default MainPlayer;
