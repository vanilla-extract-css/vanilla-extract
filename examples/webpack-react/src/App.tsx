import { atoms } from './atoms.css';

export const App = () => (
  <div
    className={atoms({
      background: 'green-200',
      color: 'green-800',
      fontFamily: 'body',
      typeSize: '5x',
      padding: '8x',
    })}
  >
    👋 Hello from vanilla-extract and Sprinkles
  </div>
);
