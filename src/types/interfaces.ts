import { z, ZodType } from "zod";

export interface SignInProps {
  username: string;
  password: string;
}

export const SignInSchema: ZodType<SignInProps> = z.object({
  username: z.string().min(1, { message: "Required field" }),
  password: z.string().min(1, { message: "Required field" }),
});

export interface SignUpProps {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUpSchema: ZodType<SignUpProps> = z
  .object({
    name: z.string().min(1, { message: "Required field" }),
    username: z.string().min(1, { message: "Required field" }),
    email: z
      .string()
      .min(1, { message: "Required field" })
      .email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Required field" }),
    confirmPassword: z.string().min(1, { message: "Required field" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export interface ForgotPasswordProps {
  email: string;
}

export const ForgotPasswordSchema: ZodType<ForgotPasswordProps> = z.object({
  email: z
    .string()
    .min(1, { message: "Required field" })
    .email({ message: "Invalid email address" }),
});

export interface ResetPasswordProps {
  password: string;
  confirmPassword: string;
}

export const ResetPasswordSchema: ZodType<ResetPasswordProps> = z
  .object({
    password: z
      .string()
      .min(8, { message: "Use at least 8 characters" })
      .max(128, { message: "Use at most 128 characters" }),
    confirmPassword: z.string().min(1, { message: "Required field" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export interface PendingLocationsProps {
  id: number;
  name: string;
  type: string;
  address: string;
  contact: string;
  coords: {
    latitude: string;
    longitude: string;
  };
  image_url?: string | null;
}
