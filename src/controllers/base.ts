import { ErrorType, ValidationError, ValidationErrorResponse } from "@src/lib/errors";
import { Response } from "express";
import mongoose from "mongoose";

// Consider using composition for error handling
export abstract class BaseController {
  protected sendErrorResponse(res: Response, error: Error): void {
    if (error instanceof mongoose.Error.ValidationError) {
      this.handleMongooseErrors(res, error);
    } else {
      this.handleInternalServerErrors(res);
    }
  }

  private handleMongooseErrors(res: Response, error: Error): void {
    const validationErrors: ValidationError[] = this.buildMongooseValidationErrors(error);
    const fieldErrors: ValidationErrorResponse = {
      type: ErrorType.VALIDATION_ERROR,
      message: 'Validation failed.',
      errors: validationErrors
    }
    res.status(400).send(fieldErrors)
  }

  private handleInternalServerErrors(res: Response): void {
    res.status(500).send({ message: 'Unexpected Error' });
  }

  private buildMongooseValidationErrors(error: mongoose.Error.ValidationError): ValidationError[] {
    return Object.values(error.errors).map(err => {
      return {
        path: err.path,
        type: err.kind,
      }
    });
  }
}
