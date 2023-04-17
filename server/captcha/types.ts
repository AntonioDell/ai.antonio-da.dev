type CaptchaValidationResult =
  | { isValid: true }
  | ({ isValid: false } & { message: string });

export { CaptchaValidationResult };
