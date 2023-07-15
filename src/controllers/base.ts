import { AuthError, InvalidParameterError } from "@src/lib/errors";
import { ErrorHandler } from "@src/services/errorHandler";
import { AuthErrorHandler } from "@src/services/errorHandler/authErrorHandler";
import { MongooseErrorHandler } from "@src/services/errorHandler/mongooseErrorHandler";
import { ServerErrorHandler } from "@src/services/errorHandler/serverErrorHandler";
import { InvalidParameterErrorHandler } from "@src/services/errorHandler/invalidParameterErrorHandler";
import { Response } from "express";
import mongoose from "mongoose";

export abstract class BaseController {
  protected sendErrorResponse(res: Response, error: Error): void {
    const errorResponse = this.createErrorHandler(error).handle();
    res.status(errorResponse.statusCode).send(errorResponse.body);
  }

  private createErrorHandler(error: Error): ErrorHandler {
    if (error instanceof mongoose.Error.ValidationError) {
      return new MongooseErrorHandler(error);
    } else if (error instanceof AuthError) {
      return new AuthErrorHandler(error);
    } else if (error instanceof InvalidParameterError) {
      return new InvalidParameterErrorHandler(error);
    } else {
      return new ServerErrorHandler();
    }
  }
}
