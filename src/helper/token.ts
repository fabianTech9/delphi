import TokenBuilder from 'phenix-edge-auth';
import * as process from 'process';

const getTag = (config): any => ({
  userId: config.userId,
});

const getToken = (config, program): string => {
  const { channelId } = program;

  const tokenBuilder = new TokenBuilder()
    .withApplicationId(process.env.NEXT_APPLICATION_ID)
    .withSecret(process.env.NEXT_SECRET)
    .expiresInSeconds(86400)
    .forChannel(channelId)
    .applyTag(JSON.stringify(getTag(config)));

  const token = tokenBuilder.build();

  // eslint-disable-next-line no-console
  console.log('Phenix Token', token);

  return 'DIGEST:eyJhcHBsaWNhdGlvbklkIjoiZGVtbyIsImRpZ2VzdCI6IkI5Y3hYN0xnUjBBamtvSlo5Nm5xb1FQMUg3enNhc2o5RElTT2piRDZTdytaOGhHUm5VUDB1eTBWQjUzQ1lMdEpWTTA4TlZUcVlpVnZmcjk4d3M2MjJBPT0iLCJ0b2tlbiI6IntcImV4cGlyZXNcIjoxOTY0MDE5MzM3MTM1LFwidXJpXCI6XCJodHRwczovL3BjYXN0LnBoZW5peHJ0cy5jb21cIixcInJlcXVpcmVkVGFnXCI6XCJjaGFubmVsSWQ6dXMtbm9ydGhlYXN0I2RlbW8jcGhlbml4V2Vic2l0ZURlbW9cIn0ifQ==';
};
export default getToken;
