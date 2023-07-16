import { ErrorResponse, ErrorType } from "@src/lib/errors/types";
import { ErrorHandler } from ".";
import { AuthError } from "@src/lib/errors";

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
