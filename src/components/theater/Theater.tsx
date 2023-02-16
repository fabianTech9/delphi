import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

import Actions from '@components/actions/Actions';
import Video from '@components/video/Video';

import styles from './Theater.module.scss';

function Theater({ config, playlist }: any): JSX.Element {
  const [hasLoaded, setHasLoaded] = useState(null);

  const content = (
    <>
      <div className={styles.videoContainer}>
        <Video config={config} playlist={playlist} />
      </div>
      <Actions />
    </>
  );
  const handleMouseEnter = (): void => {
    setHasLoaded(true);
  };

  return (
    <div className={styles.container}>
      {hasLoaded && content}

      {!hasLoaded && (
        <div className={styles.emptyState}>
          <div className={styles.header}>
            <h1>Are you ready to start the next TV experience?</h1>
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                type="button"
                onClick={handleMouseEnter}
              >
                Enter
              </button>
            </div>
          </div>
          <Player
            autoplay
            loop
            src="https://assets8.lottiefiles.com/temporary_files/jzVfLn.json"
          />
        </div>
      )}
    </div>
  );
}

export default Theater;
