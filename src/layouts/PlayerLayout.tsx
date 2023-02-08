import React from 'react';

import dynamic from 'next/dynamic';

const Video = dynamic(() => import('@components/video/Video'), { ssr: false });

function PlayerLayout({ data }: any): JSX.Element {
  if (typeof window === 'undefined') {
    return null;
  }

  return <Video config={data.config} playlist={data.playlist} />;
}

export default PlayerLayout;
