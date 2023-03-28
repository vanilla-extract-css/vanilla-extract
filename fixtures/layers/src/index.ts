import { link, pink } from './styles.css';

const html = String.raw;

document.body.innerHTML = html`
  <main>
    <p>
      <a href="#">This link</a> should be <b>red</b> on mobile, green on
      desktop.
    </p>
    <p>
      <a href="#" class=${link}>This link with class of <code>link</code></a>
      should be <b>blue</b> on mobile, green on desktop.
    </p>
    <p>
      <a href="#" class=${pink}>This link with class of <code>pink</code></a>
      should be <b>pink</b> on mobile, green on desktop.
    </p>
  </main>
`;
