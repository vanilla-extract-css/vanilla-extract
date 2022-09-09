// @ts-expect-error
import { getOptions } from 'loader-utils';
import { virtualCssFiles } from './virtualModules';

export default function (this: any) {
  return virtualCssFiles.get(this.resourcePath);
}
