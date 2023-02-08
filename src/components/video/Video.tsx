import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerEvent } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import cn from 'classname';

import styles from './Video.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function Video({ config, playlist }: any): JSX.Element {
  // eslint-disable-next-line no-console
  console.log(config, playlist);
  const playerDiv = useRef(null);
  const [player, setPlayer] = useState(null);
  const [showControls, setShowControls] = useState(false);
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