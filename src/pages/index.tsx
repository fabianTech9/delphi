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
      <link
        as="image"
        href="/icons/squeezeback-notification.svg"
        rel="preload"
      />
      <link
        as="image"
        href="https://ocmproduction-delphitheater.ocecdn.oraclecloud.com/content/published/api/v1.1/assets/CONT680EB28C349544D9B0DFD1A1B9A271B0/native/real-time-player-pause-0100.png?channelToken=d57d3338641c4004a255b7be5e742af6"
        rel="preload"
      />
      <link
        as="image"
        href="https://ocmproduction-delphitheater.ocecdn.oraclecloud.com/content/published/api/v1.1/assets/CONTA2F19C865F9145AEA78127858F76AB79/native/Lower+Third.png?channelToken=d57d3338641c4004a255b7be5e742af6"
        rel="preload"
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
