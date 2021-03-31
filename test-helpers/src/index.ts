export * from './startFixture';
export * from './getNodeStyles';
export * from './getStylesheet';

export const getTestNodes = (fixture: string) =>
  require(`@fixtures/${fixture}/test-nodes.json`);
