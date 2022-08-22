import { Redirect, Route, Switch } from 'react-router-dom';
import { Title, Meta } from 'react-head';
import { HomePage } from './HomePage/HomePage';
import { DocsPage } from './DocsPage/DocsPage';
import { ColorModeProvider } from './ColorModeToggle/ColorModeToggle';
import legacyRoutes from '../legacy-routes.json';
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

      <Switch>
        {legacyRoutes.map((route) => (
          <Redirect key={route.from} from={route.from} to={route.to} />
        ))}

        <Route path="/documentation" component={DocsPage} />
      </Switch>
    </ColorModeProvider>
  );
};
