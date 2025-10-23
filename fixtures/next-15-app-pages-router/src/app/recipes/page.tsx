import html from '@fixtures/recipes/src/html';

export default function Recipes() {
  return (
    <>
      <span id="recipes" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}


