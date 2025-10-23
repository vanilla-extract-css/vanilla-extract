import * as directFonts from '../../styles/fonts';
import { pickedValues } from '../../styles/nextFont.css';

export default function NextFontChecks() {
  const pairs: Array<[
    string,
    string | number | undefined,
    string | number | undefined,
  ]> = [];

  for (const [name, vePicked] of Object.entries(pickedValues) as Array<[
    string,
    { fontFamily: string | undefined; fontWeight: number | undefined; fontStyle: string | undefined },
  ]>) {
    const direct: any = (directFonts as any)[name];
    const style = (direct && (direct as any).style) || {};
    pairs.push([`${name}-family`, vePicked.fontFamily, style.fontFamily]);
    pairs.push([`${name}-weight`, vePicked.fontWeight, style.fontWeight]);
    pairs.push([`${name}-style`, vePicked.fontStyle, style.fontStyle]);
  }

  for (const [name, fromVe, direct] of pairs) {
    if (fromVe !== direct) {
      throw new Error(`[next-font] mismatch: ${name}: ${String(fromVe)} !== ${String(direct)}`);
    }
  }

  return (
    <div id="next-font-checks-16">
      <h2>next 16 next/font comparisons</h2>
      <ul>
        {pairs.map(([name, fromVe, direct]) => (
          <li key={name} data-name={name} data-ve={String(fromVe)} data-direct={String(direct)}>
            {name}: {String(fromVe)}
          </li>
        ))}
      </ul>
    </div>
  );
}


