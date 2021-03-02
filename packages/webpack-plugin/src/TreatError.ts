export default class TreatError extends Error {
  constructor(error: Error) {
    super(
      `treat-webpack-plugin: An error occured during compilation: \n${error.stack}`,
    );

    this.name = 'TreatError';

    Error.captureStackTrace(this, this.constructor);
  }
}
