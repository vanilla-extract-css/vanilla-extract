import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import App from './App';

// @ts-ignore
const baseUrl: string = window.BASE_URL;

ReactDom.hydrate(
  <BrowserRouter basename={baseUrl}>
    <HeadProvider>
      <App />
    </HeadProvider>
  </BrowserRouter>,
  document.getElementById('app'),
);
