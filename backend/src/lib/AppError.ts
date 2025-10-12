export class AppError extends Error {
  public readonly clientError: string;
  public readonly errorCode: number;
  public readonly serverError?: string;

  constructor(clientError: string, errorCode: number, serverError?: string) {
    super(serverError ?? clientError);
    this.name = "AppError";
    this.clientError = clientError;
    this.errorCode = errorCode;
    if (serverError !== undefined) {
      this.serverError = serverError;
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
