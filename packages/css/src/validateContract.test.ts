import { validateContract } from './validateContract';

describe('validateContract', () => {
  it('should return valid when tokens match contract', () => {
    const contract = {
      colors: {
        red: '',
        green: '',
        blue: '',
      },
      space: {
        1: '',
        2: '',
        3: '',
      },
    };

    expect(validateContract(contract, contract).valid).toBe(true);
  });

  it('should show nice diff for added properties', () => {
    const contract = {
      colors: {
        red: '',
        green: '',
        blue: '',
      },
      space: {
        1: '',
        2: '',
        3: '',
      },
    };

    const { valid, diffString } = validateContract(contract, {
      ...contract,
      fontWeight: { 300: '300' },
    });

    expect(valid).toBe(false);
    expect(diffString).toMatchInlineSnapshot(`
      " {
      +  fontWeight: ...,
       }"
    `);
  });

  it('should show nice diff for removed properties', () => {
    const contract = {
      colors: {
        red: '',
        green: '',
        blue: '',
      },
      space: {
        1: '',
        2: '',
        3: '',
      },
    };

    const { valid, diffString } = validateContract(contract, {
      ...contract,
      colors: undefined,
    });

    expect(valid).toBe(false);
    expect(diffString).toMatchInlineSnapshot(`
      " {
      -  colors: ...,
       }"
    `);
  });

  it('should show nice diff for mixed properties', () => {
    const contract = {
      colors: {
        red: '',
        green: '',
        blue: '',
      },
      space: {
        1: '',
        2: '',
        3: '',
      },
    };

    const { valid, diffString } = validateContract(contract, {
      ...contract,
      colors: undefined,
      fontWeight: { 300: '300' },
    });

    expect(valid).toBe(false);
    expect(diffString).toMatchInlineSnapshot(`
      " {
      -  colors: ...,
      +  fontWeight: ...,
       }"
    `);
  });

  it('should show nice diff for missing nested properties', () => {
    const contract = {
      colors: {
        red: '',
        green: '',
        blue: '',
      },
      space: {
        1: '',
        2: '',
        3: '',
      },
    };

    const { valid, diffString } = validateContract(contract, {
      ...contract,
      colors: {
        red: '',
        blue: '',
      },
    });

    expect(valid).toBe(false);
    expect(diffString).toMatchInlineSnapshot(`
      " {
         colors: {
      -    green: ...,
         }
       }"
    `);
  });
});
