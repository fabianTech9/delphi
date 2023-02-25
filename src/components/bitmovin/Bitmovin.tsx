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

  const playerConfig = {
    ...config,
    ui: false,
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
    if (!videoState || !player || !isReady) {
      return;
    }

    if (videoState.state === 'Paused') {
      player.seek(videoState.time);
      player.pause();
    } else if (videoState.state === 'Playing') {
      player.seek(videoState.time);
      player.play();
    } else if (videoState.state === 'Seek') {
      player.seek(videoState.time);
    }
  }, [videoState, player, isReady]);

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
