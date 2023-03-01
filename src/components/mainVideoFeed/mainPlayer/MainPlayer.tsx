import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerEvent } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import cn from 'classname';

import IconButton from '@components/iconButton/IconButton';
import Description from '@components/mainVideoFeed/description/Description';

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
}: any): JSX.Element {
  const playerConfig = useBitmovinConfig(false);
  const playerDiv = useRef(null);
  const [player, setPlayer] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [hideControlsTimer, setHideControlsTimer] = useState();

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
    }, 5000);

    // @ts-ignore
    setHideControlsTimer(timer);
    setShowControls(true);
  };

  return (
    <div
      className={cn(styles.playerWrapper, {
        [styles.showControls]: showControls,
        [styles.canCast]: currentVideo.isCastingEnabled,
      })}
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
        {currentFeed.name && (
          <p className={styles.feedName}>{currentFeed.name}</p>
        )}
        {currentFeed.subtitles && (
          <IconButton
            className={styles.subtitles}
            height={24}
            imageUrl="/icons/subtitles.svg"
            title="back"
            width={24}
          />
        )}
      </div>
    </div>
  );
}

export default MainPlayer;
