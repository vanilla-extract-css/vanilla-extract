import { browserRuntimeAdapter } from './runtime';
import { setAdapter } from './adapter';

if (typeof window !== 'undefined') {
  setAdapter(browserRuntimeAdapter);
}

export * from './api';
