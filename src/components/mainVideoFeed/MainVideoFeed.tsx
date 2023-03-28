import React, { useContext, useEffect, useState } from 'react';
import { useEventEmitter } from 'ahooks';

import { VideoContext } from '@context/video/VideoContext';
import { VideoStateContext } from '@context/videoState/VideoContext';

import MainPlayer from '@components/mainVideoFeed/mainPlayer/MainPlayer';
import PlayerAction from '@components/playerAction/PlayerAction';

import styles from './MainVideoFeed.module.scss';

import 'bitmovin-player/bitmovinplayer-ui.css';

function MainVideoFeed({ playlist }: any): JSX.Element {
  const { setCurrentVideo, currentVideo, config } = useContext(VideoContext);
  const { setVideoState, setCurrentTime, setActions } =
    useContext(VideoStateContext);
  const [currentActions, setCurrentActions] = useState([]);
  const [currentFeed, setCurrentFeed] = useState();
  const eventState$ = useEventEmitter<any>();
  const eventVideoProgress$ = useEventEmitter<any>();

  const { userId } = config;
  let i = 0;

  eventVideoProgress$.useSubscription((currentTime) => {
    const { actions } = playlist[i];

    setCurrentTime(currentTime);

    if (actions) {
      const newCurrentAction = [];

      actions.forEach((action) => {
        if (currentTime >= action.startTime && currentTime < action.endTime) {
          newCurrentAction.push(action);
        }
      });

      setCurrentActions(newCurrentAction);
      setActions(newCurrentAction);
    }
  });

  useEffect(() => {
    const setupPlayer = (): void => {
      const newVideo = playlist[0];
      const newFeed = newVideo.angles.find((angle) => angle.main);

      setCurrentVideo(newVideo);
      setVideoState(eventState$);
      setCurrentFeed(newFeed);
    };

    setupPlayer();
  }, []);

  const handleFinish = (): void => {
    i += 1;

    if (i < playlist.length) {
      const newFeed = playlist[i].angles.find((angle) => angle.main);

      setCurrentVideo(playlist[i]);
      setCurrentFeed(newFeed);
    }
  };

  return (
    <div className={styles.playerWrapper}>
      {currentFeed && currentVideo && (
        <MainPlayer
          actions={currentActions}
          currentFeed={currentFeed}
          currentVideo={currentVideo}
          eventState$={eventState$}
          eventVideoProgress$={eventVideoProgress$}
          userId={userId}
          onFinish={handleFinish}
        >
          {currentActions.map((action) => (
            <PlayerAction {...action} key={action.id} />
          ))}
        </MainPlayer>
      )}
    </div>
  );
}

export default MainVideoFeed;
