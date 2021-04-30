import { atoms } from './atoms.css';
import * as styles from './App.css';

export const App = () => (
  <div
    className={atoms({
      background: {
        lightMode: 'green-200',
        darkMode: 'gray-900',
      },
      height: '100vh',
      width: '100vw',
      display: 'flex',
      placeItems: 'center',
      padding: '6x',
    })}
  >
    <div className={styles.card}>
      <div
        className={atoms({
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: {
            mobile: '5x',
            desktop: '6x',
          },
        })}
      >
        <h1
          className={atoms({
            display: 'flex',
            fontFamily: 'body',
            color: {
              lightMode: 'green-800',
              darkMode: 'green-50',
            },
            textAlign: 'center',
            typeSize: {
              mobile: '4x',
              tablet: '4x',
              desktop: '5x',
            },
          })}
        >
          👋🧁🍨
        </h1>
        <h2
          className={atoms({
            display: 'flex',
            fontFamily: 'body',
            color: {
              lightMode: 'green-800',
              darkMode: 'green-50',
            },
            textAlign: 'center',
            typeSize: {
              mobile: '2x',
              tablet: '3x',
              desktop: '4x',
            },
          })}
        >
          Hello from vanilla-extract and Sprinkles
        </h2>
      </div>
    </div>
  </div>
);
