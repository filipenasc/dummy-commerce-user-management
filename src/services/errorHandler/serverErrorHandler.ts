import { ErrorResponse, ErrorType } from "@src/lib/errors/types";
import { ErrorHandler } from ".";

export class ServerErrorHandler extends ErrorHandler {
  constructor() {
    super();
  }

  public handle(): ErrorResponse {
    return {
      statusCode: 500,
      body: {
        type: ErrorType.SERVER_ERROR,
        message: 'Unexpected Error.',
      },
    }
  }
}
