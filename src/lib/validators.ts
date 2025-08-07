import * as z from "zod";

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])?/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
  country: z.string().min(1, "Please select your country"),
  phoneNumber: z.string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
  referralCode: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile validation schemas
export const profileUpdateSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string()
    .min(5, "Contact number must be at least 5 digits")
    .regex(/^\d+$/, "Contact number can only contain digits"),
  country: z.string().min(1, "Please select your country"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

// Trading validation schemas
export const depositRequestSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  currency: z.enum(["USDT", "BTC", "ETH"]),
  transactionId: z.string().min(1, "Transaction ID is required"),
  proofOfPayment: z.string().min(1, "Proof of payment is required"),
});

export const withdrawRequestSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  currency: z.enum(["USDT", "BTC", "ETH"]),
  walletAddress: z.string().min(1, "Wallet address is required"),
  network: z.string().min(1, "Network selection is required"),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message must be less than 1000 characters"),
  type: z.enum(["text", "image", "file"]).default("text"),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  category: z.enum(["technical", "account", "trading", "deposit", "withdrawal", "other"]),
  priority: z.enum(["low", "medium", "high"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
});

export const botSettingsSchema = z.object({
  enabled: z.boolean(),
  riskLevel: z.enum(["conservative", "moderate", "aggressive"]),
  maxInvestmentAmount: z.number().min(0),
  stopLossPercentage: z.number().min(0).max(100),
  takeProfitPercentage: z.number().min(0).max(100),
  tradingPairs: z.array(z.string()).min(1, "Select at least one trading pair"),
});

export const adminUserUpdateSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  role: z.enum(["user", "moderator", "admin"]),
  balance: z.number().min(0),
  tier: z.enum(["recruit", "bronze", "silver", "gold", "platinum", "diamond"]),
});

// Email verification schema
export const emailVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  verificationCode: z.string()
    .length(6, "Verification code must be 6 characters")
    .regex(/^[A-Z0-9]+$/, "Verification code can only contain uppercase letters and numbers"),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(100, "Subject must be less than 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

// Web page content schema
export const webPageContentSchema = z.object({
  section: z.string().min(1, "Section is required"),
  type: z.enum(["text", "image", "link", "badge", "button"]),
  content: z.string().min(1, "Content is required"),
  metadata: z.object({
    className: z.string().optional(),
    alt: z.string().optional(),
    href: z.string().optional(),
    style: z.string().optional(),
  }).optional(),
});

// Page creation schema
export const pageCreationSchema = z.object({
  name: z.string().min(1, "Page name is required").max(50, "Page name must be less than 50 characters"),
  route: z.string()
    .min(1, "Route is required")
    .regex(/^\/[a-z0-9\-\/]*$/, "Route must start with / and contain only lowercase letters, numbers, hyphens, and slashes"),
  title: z.string().max(100, "Title must be less than 100 characters").optional(),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
});
