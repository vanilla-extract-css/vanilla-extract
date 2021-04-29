import { atoms } from './atoms.css';

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
    <div
      className={atoms({
        background: {
          lightMode: 'white',
          darkMode: 'gray-800',
        },
        borderRadius: {
          mobile: '4x',
          desktop: '5x',
        },
        padding: {
          mobile: '5x',
          tablet: '6x',
          desktop: '7x',
        },
      })}
    >
      <h1
        className={atoms({
          display: 'flex',
          fontFamily: 'system',
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
        👋 Hello from vanilla-extract and Sprinkles
      </h1>
    </div>
  </div>
);
