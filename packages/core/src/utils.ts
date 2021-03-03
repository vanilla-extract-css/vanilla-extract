// Useful for ensuring hashes are legal CSS identifiers
export const sanitiseIdent = (h: string) => (/^[0-9]/.test(h[0]) ? `_${h}` : h);
