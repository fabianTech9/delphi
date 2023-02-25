import React, { createContext, useMemo, useState } from 'react';

import initialContext from './initialContext';

export const VideoStateContext = createContext(initialContext);

export default function VideoStateContextProvider({
  children,
}: any): JSX.Element {
  const [videoState, setVideoState] = useState(null);

  const context = useMemo(
    () => ({
      videoState,
      setVideoState,
    }),
    [videoState]
  );

  return (
    // @ts-ignore
    <VideoStateContext.Provider value={context}>
      {children}
    </VideoStateContext.Provider>
  );
}
