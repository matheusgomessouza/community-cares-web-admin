import { z, ZodType } from "zod";

export interface SignInProps {
  username: string;
  password: string;
}

export const SignInSchema: ZodType<SignInProps> = z.object({
  username: z.string().min(1, { message: "Required field" }),
  password: z.string().min(1, { message: "Required field" }),
});
