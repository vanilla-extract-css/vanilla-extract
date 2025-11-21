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
    </>
  );
}
