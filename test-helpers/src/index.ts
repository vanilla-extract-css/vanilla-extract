export * from './startFixture';
export * from './startFixture/next';
export * from './getStylesheet';

export const getTestNodes = (fixture: string) =>
  require(`@fixtures/${fixture}/test-nodes.json`);
