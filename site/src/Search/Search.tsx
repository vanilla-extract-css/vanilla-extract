import React, { useState, useCallback, ChangeEvent, ReactNode } from 'react';
import { HashLink } from 'react-router-hash-link';

import { search, SearchResult as SearchResultType } from './search-client';
import { Box } from '../system';
import Text from '../Typography/Text';
import HighlighWords from 'react-highlight-words';

const HighlightedWord = ({ children }: { children: ReactNode }) => (
  <Box component="mark" style={{ fontWeight: 600 }}>
    {children}
  </Box>
);

const SearchResult = ({
  route,
  hash,
  breadcrumbs,
  content,
  matches,
}: SearchResultType) => {
  return (
    <HashLink
      to={{
        pathname: route,
        hash,
      }}
    >
      <Box>
        <Text weight="strong">{breadcrumbs.map((crumb) => `> ${crumb} `)}</Text>
        <Text size="small">
          <HighlighWords
            searchWords={matches}
            textToHighlight={content.substring(0, 200)}
            highlightTag={HighlightedWord}
          />
        </Text>
      </Box>
    </HashLink>
  );
};

export default () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value),
    [setSearchTerm],
  );

  const results = searchTerm ? search(searchTerm) : [];

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleChange} />
      <Box>
        {results.length
          ? results.map((result) => (
              <SearchResult key={result.route + result.hash} {...result} />
            ))
          : null}
      </Box>
    </div>
  );
};
