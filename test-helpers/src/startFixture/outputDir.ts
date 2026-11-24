import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * Tests run in parallel, and the same fixture can be built by several of them at once
 * (e.g. in development and production mode, or for each Playwright project), so each
 * build gets its own output directory.
 *
 * It's created outside the fixture, as Parcel watches the fixture's directory, and errors
 * when another build's output directory is removed from it.
 */
export const createOutputDir = async (
  fixtureName: string,
  bundlerName: string,
): Promise<{ outputDir: string; removeOutputDir: () => Promise<void> }> => {
  const outputDir = await fs.mkdtemp(
    path.join(os.tmpdir(), `vanilla-extract-${fixtureName}-${bundlerName}-`),
  );

  return {
    outputDir,
    removeOutputDir: () => fs.rm(outputDir, { recursive: true, force: true }),
  };
};
