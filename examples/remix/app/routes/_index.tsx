import type { MetaFunction } from '@remix-run/node';

import { HelloWorld } from '../components/HelloWorld';

export const meta: MetaFunction = () => {
  return [{ title: 'Remix Example' }];
};

export default function Index() {
  return <HelloWorld />;
}
