import html from '@fixtures/sprinkles/src/html';

export default function Sprinkles() {
  return (
    <>
      <span id="sprinkles" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}


