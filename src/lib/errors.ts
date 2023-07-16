export class AuthError extends Error {}

export class InvalidParameterError extends Error {
  constructor(public path: string, public reason: string) {
    super('Invalid parameters.');
  }
}
