import React, {useEffect, useRef, useState} from "react";
import {Player, PlayerEvent} from "bitmovin-player";
import {UIFactory} from "bitmovin-player/bitmovinplayer-ui";

import "bitmovin-player/bitmovinplayer-ui.css";

function BitmovinPlayer() {
  const [player, setPlayer] = useState(null);
  const playlist = [
    {
      dash: "//bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
      "hls:":
        "//bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
    },
    {
      dash: "https://bitdash-a.akamaihd.net/content/sintel/sintel.mpd",
      hls: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    },
  ];
  let i = 0;
  const playerConfig = {
    key: "ac8c334b-49ef-4fae-8565-b05c648adc5f",
    ui: false,
    playback: {
      autoplay: true,
    },
    analytics: {
      key: "A686277F-F815-49B3-8AFB-562BE46DEE62",
      videoId: "video-id",
      title: "video title",
      userId: "fabianID",
      customData1: "any custom data 1",
      customData2: "any custom data 2",
      customData3: "any custom data 3",
      customData4: "any custom data 4",
      customData5: "any custom data 5",
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
          playerInstance.load({dash: playlist[i].dash, hls: playlist[i].hls});
        }
      });

      playerInstance.load(playlist[0]).then(() => {
        setPlayer(playerInstance);
        addSubtitles(playerInstance);
      });
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
