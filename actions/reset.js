"use server"

import * as z from "zod"
import { ResetSchema } from "@/schema"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

export const reset = async(values) => {

    const validateFieds = ResetSchema.safeParse(values);

    if(!validateFieds.success) return {error : "invalid validate"};

    const {email} = validateFieds.data;

    const existingUser = await getUserByEmail(email);
    if(!existingUser) return {error : "email not found!"};


    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    )

    return {success : "Reset email sent!"};
}