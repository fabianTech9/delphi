import React, { useContext, useEffect, useState } from 'react';

import Bitmovin from '@components/bitmovin/Bitmovin';

import { VideoContext } from '../../context/video/VideoContext';

import styles from './Angles.module.scss';

function Angles(): JSX.Element {
  const { currentVideo } = useContext(VideoContext);
  const [angles, setAngles] = useState([]);

  useEffect(() => {
    if (!currentVideo) {
      return;
    }

    const newAngles = currentVideo.angles.filter((angle) => !angle.main);

    setAngles(newAngles);
  }, [currentVideo]);

  const anglesEl = angles.map((angle) => (
    <Bitmovin currentVideo={angle} key={angle.hls} />
  ));

  return <div className={styles.container}>{anglesEl}</div>;
}

export default Angles;
