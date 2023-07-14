export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

export interface Error {
  type: ErrorType
  message: string
}

export interface ValidationError {
  path: string
  type: string
}

export interface ValidationErrorResponse extends Error {
  errors: ValidationError[]
}
