import React, { useContext, useEffect, useRef, useState } from 'react';
import { useEventEmitter } from 'ahooks';
import { Player, PlayerEvent } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import cn from 'classname';

import PlayerAction from '@components/playerAction/PlayerAction';

import { VideoContext } from '../../context/video/VideoContext';
import { VideoStateContext } from '../../context/videoState/VideoContext';

import styles from './Video.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function Video({ playlist }: any): JSX.Element {
  const { setCurrentVideo, config } = useContext(VideoContext);
  const { setVideoState, setCurrentTime } = useContext(VideoStateContext);
  const playerDiv = useRef(null);
  const [player, setPlayer] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [currentActions, setCurrentActions] = useState([]);
  const event$ = useEventEmitter<any>();

  setVideoState(event$);

  let i = 0;

  const { userId } = config;
  const playerConfig = {
    ...config,
    ui: false,
    adaptation: {
      limitToPlayerSize: true,
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
      playerInstance.on(PlayerEvent.Paused, () => {
        event$.emit({
          state: 'Paused',
          time: playerInstance.getCurrentTime(),
        });
      });
      playerInstance.on(PlayerEvent.Play, () => {
        event$.emit({
          state: 'Playing',
          time: playerInstance.getCurrentTime(),
        });
      });
      playerInstance.on(PlayerEvent.Seek, () => {
        event$.emit({
          state: 'Seek',
          time: playerInstance.getCurrentTime(),
        });
      });
      playerInstance.on(PlayerEvent.Seeked, () => {
        event$.emit({
          state: 'Seek',
          time: playerInstance.getCurrentTime(),
        });
      });
      playerInstance.on(PlayerEvent.PlaybackFinished, () => {
        i += 1;

        if (i < playlist.length) {
          setCurrentVideo(playlist[i]);
          loadVideo(playerInstance, playlist[i].angles[0]);
        }
      });

      setInterval(() => {
        const { actions } = playlist[i];
        const currentTime = playerInstance.getCurrentTime();

        setCurrentTime(currentTime);

        if (actions) {
          const newCurrentAction = [];

          actions.forEach((action) => {
            if (
              currentTime >= action.startTime &&
              currentTime < action.endTime
            ) {
              newCurrentAction.push(action);
            }
          });

          setCurrentActions(newCurrentAction);
        }
      }, 500);

      loadVideo(playerInstance, playlist[0].angles[0]).then(() => {
        setCurrentVideo(playlist[0]);
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
      {currentActions.map((action) => (
        <PlayerAction {...action} key={action.id} />
      ))}
      <div className="playerControls">
        <button
          aria-label="Custom button"
          aria-pressed="false"
          className={styles.customButton}
          type="button"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default Video;
