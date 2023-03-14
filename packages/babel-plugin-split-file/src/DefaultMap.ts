export class DefaultMap<K, V> extends Map<K, V> {
  #getDefault: (key?: K) => V;

  constructor(getDefault: (key?: K) => V, entries?: Iterable<[K, V]>) {
    super(entries);
    this.#getDefault = getDefault;
  }

  get(key: K): V {
    let ret;
    if (this.has(key)) {
      ret = super.get(key);
    } else {
      ret = this.#getDefault(key);
      this.set(key, ret);
    }

    // @ts-expect-error
    return ret;
  }
}
