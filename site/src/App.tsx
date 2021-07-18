import { Route } from 'react-router-dom';
import { Title, Meta } from 'react-head';
import { HomePage } from './HomePage/HomePage';
import { DocsPage } from './DocsPage/DocsPage';
import { ColorModeProvider } from './ColorModeToggle/ColorModeToggle';
import './App.css';

const pageTitle = 'vanilla-extract — Zero-runtime Stylesheets-in-TypeScript.';
const description = 'Zero-runtime Stylesheets-in-TypeScript.';

export default () => {
  return (
    <ColorModeProvider>
      <Title>{pageTitle}</Title>
      <Meta property="og:title" content={pageTitle} />
      <Meta name="twitter:title" content={pageTitle} />
      <Meta name="description" content={description} />
      <Meta property="og:description" content={description} />
      <Meta name="twitter:description" content={description} />
      <Route path="/" exact component={HomePage} />
      <Route path="/documentation" component={DocsPage} />
    </ColorModeProvider>
  );
};
