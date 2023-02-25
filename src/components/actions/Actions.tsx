import React, { useContext, useEffect, useState } from 'react';

import Action from '@components/action/Action';

import { VideoContext } from '../../context/video/VideoContext';
import { VideoStateContext } from '../../context/videoState/VideoContext';

import styles from './Actions.module.scss';

function Actions(): JSX.Element {
  const { currentVideo } = useContext(VideoContext);
  const { currentTime } = useContext(VideoStateContext);
  const [currentActions, setCurrentActions] = useState([]);

  useEffect(() => {
    if (currentVideo) {
      const { actions } = currentVideo;

      if (actions) {
        const newCurrentAction = [];

        actions.forEach((action) => {
          if (currentTime >= action.startTime && currentTime < action.endTime) {
            newCurrentAction.push(action);
          }
        });

        setCurrentActions(newCurrentAction);
      }
    }
  }, [currentTime, currentVideo]);

  return (
    <div className={styles.container}>
      {currentActions.map((action) => (
        <Action action={action} key={action.id} />
      ))}
    </div>
  );
}

export default Actions;
