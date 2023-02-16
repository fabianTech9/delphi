import React from 'react';

import type { AppProps } from 'next/app';
import { NextIntlProvider } from 'next-intl';

import VideoContextProvider from '../context/video/VideoContext';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps<{ messages }>): JSX.Element {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <VideoContextProvider>
        <Component {...pageProps} />
      </VideoContextProvider>
    </NextIntlProvider>
  );
}

export default MyApp;
