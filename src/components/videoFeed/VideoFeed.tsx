import React, { useContext, useEffect, useRef, useState } from 'react';
import { Player } from 'bitmovin-player';

import { VideoStateContext } from '@context/videoState/VideoContext';

import VideoState from '@components/enums/VideoState';

import useBitmovinConfig from '@hooks/useBitmovinConfig/useBitmovinConfig';

import styles from './VideoFeed.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function VideoFeed({ currentVideo }: any): JSX.Element {
  const playerConfig = useBitmovinConfig();
  const playerDiv = useRef(null);
  const [player, setPlayer] = useState(null);
  const { videoState } = useContext(VideoStateContext);

  videoState.useSubscription((event) => {
    if (!player) {
      return;
    }

    if (event.state === VideoState.Paused) {
      player.pause();
    } else if (event.state === VideoState.Playing) {
      player.seek(event.time);
      player.play();
    } else if (event.state === VideoState.Seek) {
      player.seek(event.time);
    }
  });

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
    <div className={styles.player}>
      <div className={styles.player} ref={playerDiv} />
    </div>
  );
}

export default VideoFeed;
