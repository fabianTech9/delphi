import React from 'react';

import Actions from '@components/actions/Actions';
import Video from '@components/video/Video';

import styles from './Theater.module.scss';

function Theater({ config, playlist }: any): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <Video config={config} playlist={playlist} />
      </div>
      <Actions playlist={playlist} />
    </div>
  );
}

export default Theater;
