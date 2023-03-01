import React from 'react';

import type { AppProps } from 'next/app';
import { NextIntlProvider } from 'next-intl';

import VideoContextProvider from '../context/video/VideoContext';
import VideoStateContextProvider from '../context/videoState/VideoContext';

import '../styles/styles.scss';

function MyApp({ Component, pageProps }: AppProps<{ messages }>): JSX.Element {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <VideoContextProvider>
        <VideoStateContextProvider>
          <Component {...pageProps} />
        </VideoStateContextProvider>
      </VideoContextProvider>
    </NextIntlProvider>
  );
}

export default MyApp;
