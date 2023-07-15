import { ErrorHandler } from ".";
import { ErrorResponse, ErrorType, InvalidConfirmationCodeError } from "@src/lib/errors";

export class AuthErrorHandler extends ErrorHandler {
  constructor(private error: InvalidConfirmationCodeError) {
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
