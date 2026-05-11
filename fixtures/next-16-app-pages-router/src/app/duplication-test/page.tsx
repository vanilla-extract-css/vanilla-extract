import './a-plain.css';
import { a } from './a.css';
import './b-plain.css';
import { b } from './b.css';
import './extra/c-plain.css';
import { c } from './extra/c.css';

export default function DuplicationTestPage() {
  return (
    <div>
      <div className={a}>
        <div className={b}>
          <div className={c}>duplication test</div>
        </div>
      </div>
    </div>
  );
}
