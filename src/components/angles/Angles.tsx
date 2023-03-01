import React, { useContext, useEffect, useState } from 'react';

import { VideoContext } from '@context/video/VideoContext';

import VideoFeed from '@components/videoFeed/VideoFeed';

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

  return null;

  const anglesEl = angles.map((angle) => (
    <VideoFeed currentVideo={angle} key={angle.hls} />
  ));

  return <div className={styles.container}>{anglesEl}</div>;
}

export default Angles;
