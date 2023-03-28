import React, { createContext, useMemo, useState } from 'react';

import initialContext from './initialContext';

export const VideoStateContext = createContext(initialContext);

export default function VideoStateContextProvider({
  children,
}: any): JSX.Element {
  const [videoState, setVideoState] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [actions, setActions] = useState(0);

  const context = useMemo(
    () => ({
      videoState,
      setVideoState,
      currentTime,
      setCurrentTime,
      actions,
      setActions,
    }),
    [videoState, currentTime, actions]
  );

  return (
    // @ts-ignore
    <VideoStateContext.Provider value={context}>
      {children}
    </VideoStateContext.Provider>
  );
}
