import { ErrorHandler } from ".";
import { ErrorResponse, ErrorType, InvalidParameterError } from "@src/lib/errors";

export class InvalidParameterErrorHandler extends ErrorHandler {
  constructor(private error: InvalidParameterError) {
    super();
  }

  public handle(): ErrorResponse {
    return {
      statusCode: 400,
      body: {
        type: ErrorType.VALIDATION_ERROR,
        message: this.error.message,
        errors: [
          {
            path: this.error.path,
            type: this.error.reason,
          }
        ],
      },
    }
  }
}
