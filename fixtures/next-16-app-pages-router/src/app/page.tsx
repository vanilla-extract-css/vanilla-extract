import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Link href="/sprinkles">sprinkles</Link>
      <br />
      <Link href="/recipes">recipes</Link>
      <br />
      <Link href="/features">features</Link>
      <br />
      <Link href="/function-serializer">function serializer</Link>
      <br />
      <Link href="/creepster">creepster test</Link>
      <br />
      <Link href="/next-font">next font</Link>
      <br />
      <Link href="/duplication-test">duplication test</Link>
      <br />
      <Link href="/next-image">next image</Link>
    </>
  );
}
