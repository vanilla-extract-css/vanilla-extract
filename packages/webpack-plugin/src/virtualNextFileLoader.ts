import { deserializeCss } from "@vanilla-extract/integration";

export default function (this: any) {
  const callback = this.async();
  const resourceQuery = this.resourceQuery.slice(1);

  try {
    const { source } = JSON.parse(decodeURIComponent(resourceQuery));
    deserializeCss(source)
      .then((deserializedCss) => {
        callback(null, deserializedCss);
      })
      .catch((e) => {
        callback(e as Error);
      });
  } catch (e) {
    callback(e as Error);
  }
}
