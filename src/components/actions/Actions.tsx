import React from 'react';

import Quiz from '@components/actions/quiz/Quiz';

import styles from './Actions.module.scss';

function Actions({ playlist }: any): JSX.Element {
  let content = null;

  const action = playlist[0].actions[0];

  switch (action.type) {
    case 'quiz': {
      content = <Quiz {...action} />;
      break;
    }
  }

  return <div className={styles.container}>{content}</div>;
}

export default Actions;
