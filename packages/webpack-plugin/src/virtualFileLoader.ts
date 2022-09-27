import { compiler } from './compiler';

export default function (this: any) {
  const { css } = compiler.getCssForFile(this.resourcePath);

  return css;
}
