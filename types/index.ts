export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "EVENT_NOT_FOUND"
  | "EVENT_CLOSED"
  | "EVENT_FULL"
  | "NOT_FOUND"
  | "DUPLICATE_REGISTRATION"
  | "REGISTRATION_NOT_FOUND"
  | "ALREADY_CHECKED_IN"
  | "INVALID_QR"
  | "INTERNAL_ERROR";

export interface ActionSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ActionError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export type ActionResponse<T> = ActionSuccess<T> | ActionError;
