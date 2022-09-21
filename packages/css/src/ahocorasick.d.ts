declare module 'ahocorasick' {
  export default class Ahocorasick {
    constructor(searchTerms: Array<string>);

    search(input: string): Array<[endIndex: number, matches: Array<string>]>;
  }
}
