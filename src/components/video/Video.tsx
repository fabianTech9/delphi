import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerEvent } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import cn from 'classname';

import Action from '@components/action/Action';

import styles from './Video.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function Video({ config, playlist }: any): JSX.Element {
  const playerDiv = useRef(null);
  const [player, setPlayer] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  let i = 0;

  const { userId } = config;
  const playerConfig = {
    ...config,
    ui: false,

    playback: {
      autoplay: true,
    },
  };

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
    const { hls, title, videoId, cdnProvider } = video;
    await playerInstance.load({
      hls,
      analytics: {
        title,
        videoId,
        cdnProvider,
        userId,
        customData1: 'any custom data 1',
        customData2: 'any custom data 2',
        customData3: 'any custom data 3',
        customData4: 'any custom data 4',
        customData5: 'any custom data 5',
      },
    });
    addSubtitles(playerInstance, video.subtitles);
  };

  useEffect(() => {
    const setupPlayer = (): void => {
      const playerInstance = new Player(playerDiv.current, playerConfig);

      UIFactory.buildDefaultUI(playerInstance);
      playerInstance.on(PlayerEvent.Ready, () => {
        if (i) {
          playerInstance.play();
        }
      });
      playerInstance.on(PlayerEvent.PlaybackFinished, () => {
        i += 1;

        if (i < playlist.length) {
          loadVideo(playerInstance, playlist[i]);
        }
      });

      setInterval(() => {
        const { actions } = playlist[i];
        const currentTime = playerInstance.getCurrentTime();

        if (actions) {
          let newCurrentAction;
          actions.forEach((action) => {
            if (
              currentTime >= action.startTime &&
              currentTime < action.endTime
            ) {
              newCurrentAction = action;
            }
          });

          setCurrentAction(newCurrentAction);
        }
      }, 500);

      loadVideo(playerInstance, playlist[0]).then(() => {
        addSubtitles(playerInstance, playlist[0].subtitles);
      });
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

  const handleMouseEnter = (): void => {
    setShowControls(true);
  };

  const handleMouseLeave = (): void => {
    setShowControls(false);
  };

  const handleClick = (): void => {
    alert('custom button');
  };

  return (
    <div
      className={cn(styles.playerWrapper, {
        showControls,
      })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="player" ref={playerDiv} />
      {currentAction && <Action {...currentAction} />}
      <div className="playerControls">
        <button
          aria-label="Custom button"
          aria-pressed="false"
          className={styles.customButton}
          type="button"
          onClick={handleClick}
        />
      </div>
      <img
        className={styles.watermark}
        src="https://ocmproduction-delphitheater.ocecdn.oraclecloud.com/content/published/api/v1.1/assets/CONTA2F19C865F9145AEA78127858F76AB79/native/Lower+Third.png?channelToken=d57d3338641c4004a255b7be5e742af6"
      />
    </div>
  );
}

export default Video;
