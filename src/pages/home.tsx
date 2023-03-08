import React from 'react';
import * as process from 'process';

import { GetServerSidePropsContext, GetStaticPropsResult } from 'next';
import dynamic from 'next/dynamic';

import { SlugProps } from 'types/slugProps';

import getJSONFile from '../api/file/file';
import getToken from '../helper/token';

import configJson from './config.json';
import playlistJson from './playlist.json';

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
  const player = (query?.player as string) ?? 'bitmovin';

  const config = (await getJSONFile(configUrl)) || configJson;
  const program = (await getJSONFile(playListUrl)) || playlistJson;

  const token = getToken(config, program);

  program.segments.forEach((segment) => {
    segment.angles.forEach((angle) => {
      angle.streamToken = token;
    });
  });

  return {
    props: {
      pageID: 'home',
      messages: (await import(`/messages/${locale}.json`)).default,
      data: {
        config,
        program,
        player,
        token,
      },
    },
  };
}

export default HomePage;
