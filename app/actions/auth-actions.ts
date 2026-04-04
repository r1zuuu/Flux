"use server";
import * as z from "zod";
import { LoginSchema } from "@/app/schemas";
import db from "@/lib/db";


export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid input data" };
    }
    const { email, password } = validatedFields.data;

    try {

        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "Invalid login credentials" };
        }


        return { success: true };
    } catch (error) {
        return { error: "Something went wrong" };
    }
}