"use server";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { LoginSchema } from "@/app/schemas";

export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid login credentials");
    }
    const { email, password } = validatedFields.data;
try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

  } catch (error) {
    {
          return { error: "Błędne dane logowania!" };
    }
}
}