export const emailValidation = (email: string) => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const passwordValidation = (password: string): string => {
  let error: string = "";
  const minLength = 8;
  const maxLength = 20;

  // Check password length
  if (password.length < minLength) {
    error = `Password must be at least ${minLength} characters long`;
  }

  if (password.length > maxLength) {
    error = `Password must be no more than ${maxLength} characters long`;
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    error = "Password must contain at least one uppercase letter";
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    error = "Password must contain at least one lowercase letter";
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    error = "Password must contain at least one number";
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    error = "Password must contain at least one special character";
  }

  return error;
};
