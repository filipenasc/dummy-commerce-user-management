import { ErrorHandler } from ".";
import { ErrorResponse, ErrorType, AuthError } from "@src/lib/errors";

export class AuthErrorHandler extends ErrorHandler {
  constructor(private error: AuthError) {
    super();
  }

  public handle(): ErrorResponse {
    return {
      statusCode: 401,
      body: {
        type: ErrorType.AUTH_ERROR,
        message: this.error.message,
      },
    }
  }
}
