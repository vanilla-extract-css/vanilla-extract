# Contributing

> [!IMPORTANT]
> Please ensure you read this document in its entirety before raising any PRs to the repo.
> PRs that have been raised without following the guidance detailed in this document are likely to be closed.

## Contribution types

### Small fixes

Simple bug fixes, typo corrections and minor improvements can be submitted directly as PRs.

### Bug fixes and features

For non-trivial changes, check for existing issues/discussions/PRs before raising your own.
If you don't find an existing issue for your change, _before_ implementing anything, it is **STRONGLY** recommended to discuss the change and agree upon a solution with a maintainer in a GitHub issue or discussion.
PRs containing non-trivial changes that have not been discussed elsewhere are likely to be closed.

If an issue already exists and a solution has been agreed upon, leave a comment in the issue stating that you're going to work on it and start implementing the fix/feature.
If an issue exists but there hasn't been any further discussion or a solution hasn't been agreed upon, contribute to the discussion with a minimal reproduction, a potential solution, or general feedback.

## Development setup

Before making any changes, please ensure you have done the following:

1. Ensure your PNPM version matches the version defined in `package.json#packageManager`
1. Ensure your Node.js version matches the version defined in `.nvmrc`
1. Ensure you have installed dependencies with `pnpm install`
1. Ensure you have run either `pnpm build` or `pnpm dev`

> [!NOTE]
> With the exception of the Next.js and Webpack plugins, changes to source code should be reflected immediately in tests and fixtures if you have already run `pnpm dev`.
> There is no need to run `pnpm dev` more than once, unless you've previously run `pnpm build`.
> `pnpm build` must be run before testing changes made to the Next.js and Webpack plugins.

## Testing your change

There are four methods of testing your change.

### Unit tests

Run `pnpm test:unit` to run all unit test suites with Vitest.
Run `pnpm test:unit --watch` or `pnpm test:unit -u` to run tests in watch mode or update snapshots respectively.

### Type tests

Due to the complexity of the types in Vanilla Extract, we have a few type test suites to ensure types are valid/invalid when expected.
You many need to add or modify type tests depending on the nature of your change.

Currently these type tests are files that are checked by `tsc`, rather than using a specific type testing framework such as Vitest or attest.
These files end with `type-tests.ts`.
They do not need to end with `.css.ts` since they are never evaluated.

In order to test that a type is valid, simply use the API as you would in a normal file.
If you wish to test that a type is invalid, please use the `@ts-expect-error` directive to ensure that TypeScript shows an error if the directive is not necessary.

### Fixtures

Manual testing can be done using the fixtures in the `fixtures` directory.
Fixtures for various groups of features are located in subdirectories.
To start a fixture, run `pnpm start-fixture` with the name of the fixture you want to run.
For example, to start the `features` fixture, run `pnpm start-fixture features`.
This will start a development server that consumes the library and allows you to test the features in a browser.

By default, fixtures are run in development mode using webpack.
To use a different bundler, you can specify the `--type` flag.
For example, to run the `features` fixture using Vite, run `pnpm start-fixture features --type vite`.

### E2E tests

E2E tests are executed using Playwright.
These tests take screenshots of the fixture apps and compare them to the expected screenshots.
Additionally, snapshots of the generated CSS stylesheets are taken and compared to the expected snapshots.

Run `pnpm test:playwright` to to run these tests.
Run `pnpm test:playwright -u` to update snapshots if required.

> [!NOTE]
> These tests are notoriously flaky on local machines.
> To increase your chances of successfully running these tests try running individual test suites.
> For example: `pnpm test:playwright tests/e2e/features.playwright.ts`.
> If you are struggling to run tests locally, try running them in CI on your fork.
> If screenshot snapshots are failing in your PR, you may need to ask a maintainer to update the expected screenshots on their machine.

## Linting

Run `pnpm lint` to check code formatting and lint rules.
Run `pnpm format` to fix any violations that can be automatically fixed.

## Updating documentation

The Vanilla Extract docs site is authored in markdown files located at [/site/docs].
To start the docs site locally run `pnpm start-site`.

If you are updating an existing markdown file, make your changes and commit them in your feature PR if possible.
If your change requires a new page on the documentation site and you're not sure where to put it, ask for help in the relevant issue for the change you're implementing.
If for whatever reason you are unable to write documentation to accompany your change, a maintainer can make the necessary changes for you in a separate PR.

[/site/docs]: ./site/docs

## Writing a changeset

Vanilla Extract uses [changesets] for publishing and documenting changes.
If your PR contains a change that should result in a new version of a package being published, add a changeset to your PR by running `pnpm changeset`.

A changeset should contain a brief description of the changes without describing implementation details.
They are for describing user-facing changes, including bug fixes, new features and breaking changes.
If you are unsure on how to write a changeset for your change, or whether you need one at all, ask a maintainer for help.
We take changeset authoring very seriously as it is the primary means of communication we have with consumers.

[changesets]: https://github.com/changesets/changesets

## Raising a PR

Before raising a PR, ensure all tests and lints are successful.
Keep PR descriptions concise if possible.
If you want to highlight anything particularly notable in your PR, use an inline GitHub comment instead of calling out specific lines of code in the PR description.
