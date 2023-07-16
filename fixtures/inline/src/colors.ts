import { createVar, extract$ } from '@vanilla-extract/css';

export const brand = 'green';

export const brandVar = extract$(createVar());

export const BrandDetails = () => `
    <div>Brand color is: ${brand}</div>
    <div>Brand color var is: ${brandVar}</div>
`;
