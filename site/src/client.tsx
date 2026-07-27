import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import App from './App';

const appRoot = document.getElementById('app');
if (!appRoot) {
  throw new Error('App root element not found');
}

ReactDOM.hydrateRoot(
  appRoot,
  <BrowserRouter>
    <HeadProvider>
      <App />
    </HeadProvider>
  </BrowserRouter>,
);
