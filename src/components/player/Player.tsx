import React, { useEffect, useState } from 'react';

import MainPlayer from '@components/player/mainPlayer/MainPlayer';

function Player({ playlist }: any): JSX.Element {
  const [currentFeed, setCurrentFeed] = useState();
  const currentVideo = playlist[0];

  useEffect(() => {
    const newFeed = playlist[0].angles.find((angle) => angle.main);
    setCurrentFeed(newFeed);
  });

  if (!currentFeed || !currentVideo) {
    return null;
  }

  return <MainPlayer currentFeed={currentFeed} currentVideo={currentVideo} />;
}

export default Player;
