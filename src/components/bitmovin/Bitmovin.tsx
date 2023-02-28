import React, { useContext, useEffect, useRef, useState } from 'react';
import { Player, PlayerEvent } from 'bitmovin-player';
import cn from 'classname';

import { VideoContext } from '../../context/video/VideoContext';
import { VideoStateContext } from '../../context/videoState/VideoContext';

import styles from './Bitmovin.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function Bitmovin({ currentVideo, onPlayerFinishes }: any): JSX.Element {
  const { config } = useContext(VideoContext);
  const playerDiv = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const { videoState } = useContext(VideoStateContext);

  videoState.useSubscription((event) => {
    if (!player || !isReady) {
      return;
    }

    if (event.state === 'Paused') {
      player.pause();
    } else if (event.state === 'Playing') {
      player.seek(event.time);
      player.play();
    } else if (event.state === 'Seek') {
      player.seek(event.time);
    }
  });

  const playerConfig = {
    ...config,
    ui: false,
    playback: {
      muted: true,
    },
    adaptation: {
      limitToPlayerSize: true,
    },
  };

  const loadVideo = async (playerInstance, video): Promise<void> => {
    const { hls } = video;
    await playerInstance.load({
      hls,
    });
  };

  useEffect(() => {
    if (player && currentVideo) {
      loadVideo(player, currentVideo);
    }
  }, [currentVideo, player]);

  useEffect(() => {
    const setupPlayer = (): void => {
      const playerInstance = new Player(playerDiv.current, playerConfig);

      playerInstance.on(PlayerEvent.Ready, () => {
        setIsReady(true);
      });
      playerInstance.on(PlayerEvent.PlaybackFinished, () => {
        onPlayerFinishes();
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

  return (
    <div className={cn(styles.playerWrapper)}>
      <div className="player" ref={playerDiv} />
    </div>
  );
}

export default Bitmovin;
