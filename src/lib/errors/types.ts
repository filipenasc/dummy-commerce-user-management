export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

interface BaseErrorResponseBody {
  type: ErrorType
  message: string
}

interface ValidationErrorResponseBody extends BaseErrorResponseBody {
  errors: ValidationError[]
}

export type ErrorResponseBody = BaseErrorResponseBody | ValidationErrorResponseBody;

export interface ErrorResponse {
  statusCode: number
  body: ErrorResponseBody
}

export interface ValidationError {
  path: string
  type: string
}
