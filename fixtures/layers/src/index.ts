import { link, pink } from './styles.css';

const html = String.raw;

document.body.innerHTML = html`
  <!-- modified from https://codepen.io/web-dot-dev/pen/LYzqPEp -->
  <main>
    <p>
      In this example, I'm showcasing the power of
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@layer"
        >cascade layers</a
      >, using <code>@layer</code>. This is a
      <a href="#">link without class name</a>. You can see it appears green.
      This is a
      <a href="#" class=${link}> link with class of <code>link</code></a
      >. It, too, appears green, even though I specify the color of
      <code>.link</code> elements to be blue. While <code>.link</code> has a
      higher element-level specificity than <code>a</code>, I am setting a color
      style on <code>a</code> in a higher-precedence <code>@layer</code>.
    </p>
    <div
      style="padding-left: 1rem; margin-left: 1rem; border-left: 4px solid hotpink;"
    >
      <p>
        The <em>layer</em> precedence beats the <em>element specificity</em>.
      </p>
    </div>
    <p>
      Now, I have an even <em>more</em> specific layer called
      <code>utilities</code> where I have a class called <code>pink</code>. This
      is a <a href="#" class=${pink}>link with class of <code>pink</code></a
      >. This specificity wins.
    </p>
  </main>
`;
