import parseArgs from 'minimist';
import { startFixture } from './startFixture';

const {
  _: [fixtureName],
  type,
  hot,
} = parseArgs(process.argv.slice(2));

startFixture(fixtureName, { type, hot }).then((server) => {
  // eslint-disable-next-line no-console
  console.log('Fixture running on', server.url);
});
