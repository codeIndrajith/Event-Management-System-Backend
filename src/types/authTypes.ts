export interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  token: string;
  message?: string;
}

export enum Role {
  Admin = "Admin",
  Organizer = "Organizer",
  Participant = "Participant",
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}
