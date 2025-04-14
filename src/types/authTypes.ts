export interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  token: string;
  message?: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  roleName: string;
}

export interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}
