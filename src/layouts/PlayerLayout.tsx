import React from 'react';

import dynamic from 'next/dynamic';

const Theater = dynamic(() => import('@components/theater/Theater'), {
  ssr: false,
});

function PlayerLayout({ data }: any): JSX.Element {
  if (typeof window === 'undefined') {
    return null;
  }

  return <Theater config={data.config} playlist={data.playlist} />;
}

export default PlayerLayout;
