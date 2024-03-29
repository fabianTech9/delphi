import React, { useState } from 'react';
import { Player as LottiePlayer } from '@lottiefiles/react-lottie-player';

import Actions from '@components/actions/Actions';
import Angles from '@components/angles/Angles';
import MainVideoFeed from '@components/bitmovin/MainVideoFeed';
import Dolby from '@components/dolby/Dolby';
import Player from '@components/phenix/Player';

import styles from './Theater.module.scss';

function Theater({ program, player }: any): JSX.Element {
  const [hasLoaded, setHasLoaded] = useState(null);

  const playlist = program.segments;
  const isPhenix = player === 'phenix';
  const isDolby = player === 'dolby';
  let playerElement;

  if (isDolby) {
    playerElement = <Dolby overlay={program.overlay} playlist={playlist} />;
  } else if (isPhenix) {
    playerElement = <Player overlay={program.overlay} playlist={playlist} />;
  } else {
    playerElement = <MainVideoFeed playlist={playlist} />;
  }

  const content = (
    <>
      <div className={styles.videoContainer}>{playerElement}</div>
      <Angles />
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
          <LottiePlayer
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
