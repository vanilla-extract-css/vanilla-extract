import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Link href="/pages-router/sprinkles">sprinkles</Link>
      <br />
      <Link href="/pages-router/recipes">recipes</Link>
      <br />
      <Link href="/pages-router/features">features</Link>
    </>
  );
}


