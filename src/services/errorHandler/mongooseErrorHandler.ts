import mongoose from "mongoose";
import { ErrorHandler } from ".";
import { ErrorResponse, ErrorType, ValidationError } from "@src/lib/errors/types";

export class MongooseErrorHandler extends ErrorHandler {
  constructor(private error: mongoose.Error.ValidationError) {
    super();
  }

  public handle(): ErrorResponse {
    return {
      statusCode: 400,
      body: {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Validation failed.',
        errors: this.buildErrors(),
      },
    }
  }

  private buildErrors(): ValidationError[] {
    return Object.values(this.error.errors).map(({ path, kind: type }) => ({ path, type }));
  }
}
