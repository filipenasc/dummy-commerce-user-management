import { ErrorResponse } from "@src/lib/errors/types";

export interface ErrorHandlerStrategy {
  handle: () => ErrorResponse
}

export abstract class ErrorHandler {
  abstract handle(): ErrorResponse
}
