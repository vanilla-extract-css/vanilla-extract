const path = require('path');
const { cpSync, existsSync } = require('fs');

// Copy next plugin dist files.
// This is a workaround to prevent @vanilla-extract/next-plugin
// resolving to next 12 peer dependency
const main = () => {
  const nextPluginDir = path.dirname(
    require.resolve('@vanilla-extract/next-plugin/package.json'),
  );

  const nextPluginDistDir = path.join(nextPluginDir, 'dist');

  if (!existsSync(nextPluginDistDir)) {
    throw new Error('@vanilla-extract/next-plugin dist is missing.');
  }

  cpSync(nextPluginDistDir, path.join(process.cwd(), 'next-plugin', 'dist'), {
    recursive: true,
  });
};

main();
