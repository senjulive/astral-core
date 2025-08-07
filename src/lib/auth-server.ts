import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import * as path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'astralcore-secret-key-hyperdrive-v5';
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Mock admin credentials
const MOCK_ADMIN_EMAIL = "admin@astralcore.io";
const MOCK_MODERATOR_EMAIL = "moderator@astralcore.io";
const MOCK_ADMIN_PASS = "admin";
const MOCK_MODERATOR_PASS = "moderator";

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  country?: string;
  isVerified: boolean;
  createdAt: string;
  tier: 'recruit' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  isActive: boolean;
  lastLogin?: string;
  verificationCode?: string;
  resetPasswordCode?: string;
  role: 'user' | 'admin' | 'moderator';
}

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

type Credentials = {
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  country?: string;
  referralCode?: string;
  options?: any;
}

export async function login(credentials: Credentials) {
  console.log("Login Attempt with:", credentials.email);
  
  if (!credentials.email || !credentials.password) {
    return { error: "Please provide both email and password." };
  }

  // Check mock admin/moderator credentials first
  if (credentials.email === MOCK_ADMIN_EMAIL && credentials.password === MOCK_ADMIN_PASS) {
    const token = jwt.sign(
      { 
        userId: 'admin_001', 
        email: credentials.email,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    return { 
      error: null, 
      role: 'admin',
      token,
      user: {
        id: 'admin_001',
        email: credentials.email,
        fullName: 'System Administrator',
        role: 'admin'
      }
    };
  }

  if (credentials.email === MOCK_MODERATOR_EMAIL && credentials.password === MOCK_MODERATOR_PASS) {
    const token = jwt.sign(
      { 
        userId: 'mod_001', 
        email: credentials.email,
        role: 'moderator'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    return { 
      error: null, 
      role: 'moderator',
      token,
      user: {
        id: 'mod_001',
        email: credentials.email,
        fullName: 'System Moderator',
        role: 'moderator'
      }
    };
  }

  // Check regular users
  const users = await readUsers();
  const user = users.find(u => u.email === credentials.email);
  
  if (!user) {
    return { error: "Invalid email or password" };
  }

  if (!user.isActive) {
    return { error: "Account is deactivated. Please contact support." };
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  
  if (!isPasswordValid) {
    return { error: "Invalid email or password" };
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  await writeUsers(users);

  // Create JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      tier: user.tier,
      isVerified: user.isVerified,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    error: null,
    role: user.role,
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      tier: user.tier,
      balance: user.balance,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      role: user.role
    }
  };
}

export async function register(credentials: Credentials) {
  console.log("Registration Attempt for:", credentials.email);
  
  if (!credentials.email || !credentials.password || !credentials.fullName) {
    return { error: 'Please provide all required information.' };
  }

  if (credentials.email === MOCK_ADMIN_EMAIL || credentials.email === MOCK_MODERATOR_EMAIL) {
    return { error: "This email is reserved. Please use a different email." };
  }

  // Read existing users
  const users = await readUsers();
  
  // Check if user already exists
  if (users.find(user => user.email === credentials.email)) {
    return { error: 'User already exists with this email address' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(credentials.password, 12);

  // Generate verification code
  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Create user
  const user: User = {
    id: generateUserId(),
    email: credentials.email,
    password: hashedPassword,
    fullName: credentials.fullName,
    phoneNumber: credentials.phoneNumber,
    country: credentials.country,
    isVerified: false,
    createdAt: new Date().toISOString(),
    tier: 'recruit',
    balance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalProfits: 0,
    isActive: true,
    verificationCode,
    role: 'user'
  };

  users.push(user);
  await writeUsers(users);

  return { 
    error: null, 
    user: { 
      id: user.id, 
      email: user.email, 
      fullName: user.fullName,
      tier: user.tier,
      balance: user.balance,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      role: user.role
    },
    verificationCode // In production, this would be sent via email
  };
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Handle admin/moderator tokens
    if (decoded.role === 'admin' || decoded.role === 'moderator') {
      return {
        success: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          fullName: decoded.role === 'admin' ? 'System Administrator' : 'System Moderator',
          role: decoded.role
        }
      };
    }

    const users = await readUsers();
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user || !user.isActive) {
      return { error: 'User not found or inactive' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        tier: user.tier,
        balance: user.balance,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        role: user.role
      }
    };
  } catch (error) {
    return { error: 'Invalid or expired token' };
  }
}

export async function verifyEmail(email: string, verificationCode: string) {
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    return { error: 'User not found' };
  }

  const user = users[userIndex];
  
  if (user.isVerified) {
    return { error: 'Email already verified' };
  }

  if (user.verificationCode !== verificationCode) {
    return { error: 'Invalid verification code' };
  }

  // Verify user
  users[userIndex].isVerified = true;
  users[userIndex].verificationCode = undefined;
  await writeUsers(users);

  return { success: true, message: 'Email verified successfully' };
}

export async function resetPasswordForEmail(email: string) {
  console.log("Password Reset requested for:", email);
  
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    // Return success even if user not found for security
    return { success: true, message: 'If an account with this email exists, a reset code has been sent.' };
  }

  const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  users[userIndex].resetPasswordCode = resetCode;
  await writeUsers(users);

  return { 
    success: true, 
    message: 'Password reset code sent to your email.',
    resetCode // In production, this would be sent via email
  };
}

export async function resetPassword(email: string, resetCode: string, newPassword: string) {
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    return { error: 'Invalid reset code' };
  }

  const user = users[userIndex];
  
  if (user.resetPasswordCode !== resetCode) {
    return { error: 'Invalid or expired reset code' };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update password and clear reset code
  users[userIndex].password = hashedPassword;
  users[userIndex].resetPasswordCode = undefined;
  await writeUsers(users);

  return { success: true, message: 'Password reset successfully' };
}

export async function getUserById(userId: string): Promise<User | null> {
  const users = await readUsers();
  return users.find(user => user.id === userId) || null;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { error: 'User not found' };
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  await writeUsers(users);

  return { success: true, user: users[userIndex] };
}

export async function logout() {
  // In a real app, you would clear the session/token here.
  // For the demo app, this is handled on the client side
  return { success: true };
}

function generateUserId(): string {
  return 'usr_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
