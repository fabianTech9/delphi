import React, { createContext, useMemo, useState } from 'react';

import initialContext from './initialContext';

export const VideoContext = createContext(initialContext);

export default function VideoContextProvider({ children }: any): JSX.Element {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);

  const context = useMemo(
    () => ({
      currentTime,
      setCurrentTime,
      currentVideo,
      setCurrentVideo,
    }),
    [currentTime]
  );

  return (
    // @ts-ignore
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  );
}
