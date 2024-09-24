import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import App from './App';

ReactDOM.hydrateRoot(
  document.getElementById('app')!,
  <BrowserRouter>
    <HeadProvider>
      <App />
    </HeadProvider>
  </BrowserRouter>,
);
