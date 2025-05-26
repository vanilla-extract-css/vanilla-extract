# Contributing

## Initial setup

Before making any changes, please ensure you have done the following:

1. Ensure your PNPM version matches the version defined in `package.json#packageManager`
1. Ensure your NPM version matches the version defined in `.nvmrc`
1. Ensure you have installed dependencies with `pnpm install`

## Testing your change

There are four methods of testing your change.

### Unit tests

Unit tests are written using Jest and Vitest.
Vitest tests are really only used for testing the compiler to ensure it works in Vitest.
Jest tests are used for testing the main functionality of the library.
Unless you have a good reason to use Vitest, you should write your tests using Jest.

Run `pnpm test:unit` to run all unit test suites, or run either `pnpm test:jest` or `pnpm test:vitest` to run the Jest or Vitest test suites respectively.

Append the `--watch` or `-u` flags to the `pnpm test:jest` or `pnpm test:vitest` scripts if you need to run tests in watch mode or update snapshots.

### Type tests

Due to the complexity of the types in Vanilla Extract, we have a few type test suites to ensure types are valid/invalid when expected.

Currently these type tests are simply files that are checked by `tsc`, rather than using a specific type testing framework such as Vitest or attest.
These files end with `type-tests.ts`.
They do not need to end with `.css.ts` since they are never evaluated.

In order to test that a type is valid, simply use the API as you would in a normal file.
If you wish to test that a type is invalid, please use the `@ts-expect-error` directive to ensure that TypeScript shows an error if the directive is not necessary.

### Fixtures

Manual testing can be done using the fixtures in the `fixtures` directory.
Fixtures for various groups of features are located in subdirectories.
To start a fixture, run `pnpm start-fixture` with the name of the fixture you want to run.
For example, to start the `features` fixture, run `pnpm start-fixture features`.
This will start a simple web application development server that consumes the library and allows you to test the features in a browser.

By default, fixtures are run in development mode using webpack.
To use a different bundler, you can specify the `--type` flag.
For example, to run the `features` fixture using Vite, run `pnpm start-fixture features --type vite`.

### E2E tests

E2E tests are executed using Playwright.
These tests take screenshots of the fixtures and compare them to the expected screenshots.
Additionally, snapshots of the generated CSS stylesheets are taken and compared to the expected snapshots.

> [!NOTE]
> These tests are notoriously flaky on local machines.
> If you are struggling to get them to pass, try running them in CI (you may need to ask a maintainer to approve your CI run.
> If screenshots are failing, you may need to ask a maintainer to update the expected screenshots on their machine.
