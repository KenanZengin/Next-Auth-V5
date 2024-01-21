"use server"

import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schema";
import {  getPaswordResetTokenByToken } from "@/data/password-reset-token";
import { db } from "@/lib/db";

export const newPassword = async (values,token) => {

    if(!token){
        return {error : "Missing token!"};
    }


    const validateFields = NewPasswordSchema.safeParse(values);

    if(!validateFields){
        return {error : "Invalid fields!"}
    }

    const {password} = validateFields.data;

    const existingToken = await getPaswordResetTokenByToken(token);

    if(!existingToken){
        
        return {error: "Invalid token!"};
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired){
        return {error : "Token has exprid!"};
    }

    console.log("existingToken",existingToken);
    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser){
        return {error : "Email does not existing"};
    }

    const hasPassword = await bcrypt.hash(password,10);

    await db.user.update({
        where: {id : existingUser.id},
        data : {password : hasPassword},
    })

    await db.passwordResetToken.delete({
        where: {id: existingToken.id},
    })

    return {success : "Password updated!"}




}