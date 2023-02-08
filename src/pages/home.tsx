import React from 'react';
import * as process from 'process';

import { GetServerSidePropsContext, GetStaticPropsResult } from 'next';
import dynamic from 'next/dynamic';

import { SlugProps } from 'types/slugProps';

import getJSONFile from '../api/file/file';

const PlayerLayout = dynamic(() => import('@layouts/PlayerLayout'));

function HomePage({ data }: SlugProps): JSX.Element {
  if (typeof window === 'undefined') {
    return null;
  }

  return <PlayerLayout data={data} />;
}

export async function getServerSideProps({
  locale,
  query,
}: GetServerSidePropsContext): Promise<GetStaticPropsResult<SlugProps>> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const configUrl = (query?.config as string) ?? `${baseUrl}/config.json`;
  const playListUrl = (query?.media as string) ?? `${baseUrl}/playlist.json`;

  const config = await getJSONFile(configUrl);
  const playlist = await getJSONFile(playListUrl);

  return {
    props: {
      pageID: 'home',
      messages: (await import(`/messages/${locale}.json`)).default,
      data: {
        config,
        playlist,
      },
    },
  };
}

export default HomePage;
