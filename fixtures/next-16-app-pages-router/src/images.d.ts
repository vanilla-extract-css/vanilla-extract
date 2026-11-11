// Next.js declares image imports in `next-env.d.ts`, which is gitignored, so
// they're declared here for the repo's root type check
declare module '*.png' {
  const src: string;
  export default src;
}
