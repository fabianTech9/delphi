import React, {useEffect, useRef, useState} from "react";
import {Player, PlayerEvent} from "bitmovin-player";
import {UIFactory} from "bitmovin-player/bitmovinplayer-ui";

import "bitmovin-player/bitmovinplayer-ui.css";

function BitmovinPlayer({userId, playlist}) {
  const [player, setPlayer] = useState(null);
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

  const addSubtitles = (playerInstance) => {
    const enSubtitle = {
      id: "sub1",
      lang: "en",
      label: "English",
      url: "https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt",
      kind: "subtitle",
    };
    const esSubtitle = {
      id: "sub2",
      lang: "es",
      label: "Español",
      url: "https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_es.vtt",
      kind: "subtitle",
    };
    playerInstance.subtitles.add(enSubtitle);
    playerInstance.subtitles.add(esSubtitle);
  };

  const loadVideo = (playerInstance, video) => {
    return playerInstance.load({
      hls: video.hls,
      analytics: {
        title: video.title,
        videoId: video.videoId,
        cdnProvider: video.cdnProvider,
        userId,
        customData1: "any custom data 1",
        customData2: "any custom data 2",
        customData3: "any custom data 3",
        customData4: "any custom data 4",
        customData5: "any custom data 5",
      }
    });
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

  return <div id="player" ref={playerDiv}/>;
}

export default BitmovinPlayer;
