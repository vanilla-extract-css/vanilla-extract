import { DocSearch } from '@docsearch/react';
import '@docsearch/css';
import { ComponentProps } from 'react';

import './SearchInput.css';
import { Box } from '../system';

type DocSearchProps = ComponentProps<typeof DocSearch>;

// Make search item URLs relative so the local site doesn't take you back to prod
const transformSearchResultItems: DocSearchProps['transformItems'] = (items) =>
  items.map((item) => {
    const url = new URL(item.url);

    return {
      ...item,
      url: url.pathname,
    };
  });

const getMissingResultsUrl: DocSearchProps['getMissingResultsUrl'] = ({
  query,
}) =>
  `https://github.com/vanilla-extract-css/vanilla-extract/issues/new?assignees=&labels=pending+triage&template=bug_report.yml&bug-description=Search query \`${encodeURIComponent(
    query,
  )}\` should return search results.`;

export const SearchInput = () => (
  <Box paddingRight="medium">
    <DocSearch
      appId="ABPL1AJSFN"
      apiKey="d0d2252fbd30f7cb523a50c5a7780078"
      indexName="vanilla-extract"
      transformItems={transformSearchResultItems}
      getMissingResultsUrl={getMissingResultsUrl}
    />
  </Box>
);
