import * as z from "zod";


export const LoginSchema = z.object({
  email: z
    .email({ message: "Wprowadź poprawny adres e-mail" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: "Hasło jest wymagane" }) 
});