import React from 'react';

import type { AppProps } from 'next/app';
import { NextIntlProvider } from 'next-intl';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps<{ messages }>): JSX.Element {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <Component {...pageProps} />
    </NextIntlProvider>
  );
}

export default MyApp;
