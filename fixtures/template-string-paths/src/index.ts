import { emptySquareBrackets } from './[]/index.css';
import { singleSquareBracketsId } from './[id]/index.css';
import { doubleSquareBracketId } from './[[id]]/index.css';
import { catchAllSegment } from './[...slug]/index.css';
import { optionalCatchAllSegment } from './[[...slug]]/index.css';
import { withHyphen } from './[blog-id]/index.css';

// Fixture for testing escaping of webpack template strings and Next.js dyanmic routes
// https://webpack.js.org/configuration/output/#template-strings
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
function render() {
  document.body.innerHTML = `
    <div class="${emptySquareBrackets}">[] path</div>
    <div class="${singleSquareBracketsId}">[id] path</div>
    <div class="${doubleSquareBracketId}">[[id]] path</div>
    <div class="${catchAllSegment}">[...slug] path</div>
    <div class="${optionalCatchAllSegment}">[[...slug]] path</div>
    <div class="${withHyphen}">[blog-id] path</div>
  `;
}

render();
