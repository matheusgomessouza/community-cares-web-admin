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
    path: ["password", "confirmPassword"],
  });
