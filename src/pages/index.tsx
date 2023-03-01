import React from 'react';

import type { NextPage } from 'next';
import Head from 'next/head';

import { SlugProps } from 'types/slugProps';

import Home, { getServerSideProps } from '@pages/home';

const Main: NextPage = ({ data }: SlugProps): JSX.Element => (
  <div>
    <Head>
      <title>Delphi</title>
      <meta content="Delphi" name="description" />
      <link href="https://use.typekit.net/bap8ixx.css" rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css2?family=Red+Hat+Display&display=swap"
        rel="stylesheet"
      />
      <script src="https://dl.phenixrts.com/JsSDK/2022.0.latest/min/channels.js" />
    </Head>
    <main>
      <Home data={data} />
    </main>
  </div>
);

export default Main;
export { getServerSideProps };
