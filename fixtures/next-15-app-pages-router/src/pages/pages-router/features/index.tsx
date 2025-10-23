import html from '@fixtures/features/src/html';

export default function Features() {
  return (
    <>
      <span id="features" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}


