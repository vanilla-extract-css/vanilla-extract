export default class VanillaExtractError extends Error {
  constructor(error: Error) {
    super(
      `@vanilla-extract/webpack-plugin: An error occured during compilation: \n${error.stack}`,
    );

    this.name = 'VanillaExtractError';

    Error.captureStackTrace(this, this.constructor);
  }
}
