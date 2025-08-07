// Client-side auth utilities that use API endpoints
// This file is safe to import in client components

export interface AuthResponse {
  error?: string;
  success?: boolean;
  user?: any;
  token?: string;
  role?: string;
  message?: string;
  verificationCode?: string;
  resetCode?: string;
}

export async function clientLogin(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function clientRegister(credentials: {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  country?: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function clientLogout(): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function clientForgotPassword(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function clientResetPassword(
  email: string,
  resetCode: string,
  newPassword: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, resetCode, newPassword }),
    });

    return await response.json();
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function clientVerifyEmail(
  email: string,
  verificationCode: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, verificationCode }),
    });

    return await response.json();
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

// Legacy function name for compatibility
export const logout = clientLogout;
