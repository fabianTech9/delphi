import React, { useContext, useEffect } from 'react';

import dynamic from 'next/dynamic';

import { VideoContext } from '../context/video/VideoContext';

const Theater = dynamic(() => import('@components/theater/Theater'), {
  ssr: false,
});

function PlayerLayout({ data }: any): JSX.Element {
  const { setToken } = useContext(VideoContext);

  useEffect(() => {
    setToken(data.token);
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Theater config={data.config} player={data.player} program={data.program} />
  );
}

export default PlayerLayout;
