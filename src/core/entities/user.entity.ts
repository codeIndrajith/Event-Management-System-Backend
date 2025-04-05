export class User {
  constructor(
    public id: number,
    public email: string,
    public name: string | null,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  // Main domatin validation Method
  validate(): void {
    this.emailValidationClass();
    this.passwordValidationClass();
  }

  // Email validation class
  private emailValidationClass(): void {
    if (!this.isEmailValid(this.email)) {
      throw new Error("Invalid email format");
    }
  }

  // Validation password
  private passwordValidationClass(): void {
    const errors: string[] = [];

    if (!this.hasMinimumLength(this.password, 8)) {
      errors.push("Password must be at least 8 characters");
    }
    if (!this.hasSpecialChar(this.password)) {
      errors.push("Password must contain at least one special character");
    }
    if (!this.hasNumber(this.password)) {
      errors.push("Password must contain at least one number");
    }
    if (!this.hasUpperCase(this.password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  // Validation helpers
  private isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private hasMinimumLength(value: string, min: number): boolean {
    return value.length >= min;
  }

  private hasSpecialChar(value: string): boolean {
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialCharRegex.test(value);
  }

  private hasNumber(value: string): boolean {
    return /\d/.test(value);
  }

  private hasUpperCase(value: string): boolean {
    return /[A-Z]/.test(value);
  }
}
