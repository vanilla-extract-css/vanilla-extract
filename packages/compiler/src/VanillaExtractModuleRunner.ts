import {
  ssrDynamicImportKey,
  ssrExportAllKey,
  ssrExportNameKey,
  ssrImportKey,
  ssrImportMetaKey,
  ssrModuleExportsKey,
} from 'vite/module-runner';
import type { ModuleEvaluator, ModuleRunnerContext } from 'vite/module-runner';

// AsyncFunction constructor (not globally typed in TS)
const AsyncFunction = async function () {}.constructor as typeof Function;

/**
 * Custom evaluator that assigns injected state onto globalThis before each
 * module executes. Properties on globalThis are accessible as free variables
 * even in strict mode.
 */
export class VanillaExtractModuleRunner implements ModuleEvaluator {
  startOffset = 2;
  injectedGlobalState: Record<string, unknown> | undefined;

  setInjectedGlobalState(i: Record<string, unknown>) {
    this.injectedGlobalState = i;
  }

  async runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
  ): Promise<void> {
    if (!this.injectedGlobalState) {
      throw new Error(
        'Failed to set injected global state. You must call `setInjectedGlobalState` before calling `runInlinedModule`.',
      );
    }

    Object.assign(globalThis, this.injectedGlobalState);

    const initModule = new AsyncFunction(
      ssrModuleExportsKey,
      ssrImportMetaKey,
      ssrImportKey,
      ssrDynamicImportKey,
      ssrExportAllKey,
      ssrExportNameKey,
      '"use strict";' + code,
    );

    await initModule(
      context[ssrModuleExportsKey],
      context[ssrImportMetaKey],
      context[ssrImportKey],
      context[ssrDynamicImportKey],
      context[ssrExportAllKey],
      context[ssrExportNameKey],
    );

    Object.seal(context[ssrModuleExportsKey]);
  }

  runExternalModule(filepath: string): Promise<any> {
    return import(filepath);
  }
}
