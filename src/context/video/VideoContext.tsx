import React, { createContext, useMemo, useState } from 'react';

import initialContext from './initialContext';

export const VideoContext = createContext(initialContext);

export default function VideoContextProvider({ children }: any): JSX.Element {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [token, setToken] = useState('');
  const [config, setConfig] = useState(null);

  const context = useMemo(
    () => ({
      config,
      setConfig,
      token,
      setToken,
      currentTime,
      setCurrentTime,
      currentVideo,
      setCurrentVideo,
    }),
    [currentTime, currentVideo, token, config]
  );

  return (
    // @ts-ignore
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  );
}
