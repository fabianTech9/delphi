import React, {useEffect, useRef, useState} from "react";
import {Player, PlayerEvent} from "bitmovin-player";
import {UIFactory} from 'bitmovin-player-ui';

function BitmovinPlayer({userId, playlist}) {
  const [player, setPlayer] = useState(null);
  const [showControls, setShowControls] = useState(false);
  let i = 0;
  const playerConfig = {
    key: "ac8c334b-49ef-4fae-8565-b05c648adc5f",
    ui: false,
    playback: {
      autoplay: true,
    },
    analytics: {
      key: "A686277F-F815-49B3-8AFB-562BE46DEE62",
    },
  };
  const playerDiv = useRef();
  const addSubtitles = (playerInstance, subtitles) => {
    if (!subtitles || !subtitles.length) {
      return;
    }

    subtitles.forEach((subtitle, i) => {
      subtitle.id = `sub${i}`;
      subtitle.kind = "subtitle";

      playerInstance.subtitles.add(subtitle);
    });
  };

  const loadVideo = async (playerInstance, video) => {
    const {hls, title, videoId, cdnProvider} = video
    await playerInstance.load({
      hls,
      analytics: {
        title,
        videoId,
        cdnProvider,
        userId,
        customData1: "any custom data 1",
        customData2: "any custom data 2",
        customData3: "any custom data 3",
        customData4: "any custom data 4",
        customData5: "any custom data 5",
      }
    });
    addSubtitles(playerInstance, video.subtitles);
  }

  useEffect(() => {
    function setupPlayer() {
      const playerInstance = new Player(playerDiv.current, playerConfig);

      UIFactory.buildDefaultUI(playerInstance);
      playerInstance.on(PlayerEvent.Ready, () => {
        if (i) {
          playerInstance.play();
        }
      });
      playerInstance.on(PlayerEvent.PlaybackFinished, () => {
        i++;

        if (i < playlist.length) {
          loadVideo(playerInstance, playlist[i]);
        }
      });

      loadVideo(playerInstance, playlist[0]).then(() => {
        addSubtitles(playerInstance);
      });
      setPlayer(playerInstance);
    }

    setupPlayer();

    return () => {
      function destroyPlayer() {
        if (player != null) {
          player.destroy();
          setPlayer(null);
        }
      }

      destroyPlayer();
    };
  }, []);

  const handleMouseEnter = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    setShowControls(false)
  }

  const handleClick = () => {
    alert('custom button')
  }

  return (
    <div className={showControls ? 'content showControls' : 'content'}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}>
      <div className='player-wrapper'>
        <div id="player" className='player' ref={playerDiv}/>
        <div className="player-controls">
          <button aria-label="Custom button"
                  className="bmpui-ui-settingstogglebutton custom-button bmpui-off"
                  type="button"
                  aria-pressed="false"
                  onClick={handleClick}
          >
            <span className="bmpui-label">Custom button</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BitmovinPlayer;
