import { startFixture } from './startFixture';

const fixtureName = process.argv[2];

startFixture(fixtureName).then((server) => {
  // eslint-disable-next-line no-console
  console.log('Fixture running on', server.url);
});
