"use server" //işi garantiye almak için server kullanıyoruz

import * as z from "zod"
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";



export const login = async (values,callbackUrl) => { // login formundan aldığımız verileri serverde işleme alıyoruz
    console.log(values);
    const validateFields = LoginSchema.safeParse(values);

    if(!validateFields.success){
        return{error:"Invalid fields"}
    }

    const {email, password, code} = validateFields.data;
    
    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error : "Email not existing!"}
    }
    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return {success: "Confirmation Email sent!"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(code){
            
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(!twoFactorToken){
                return {error : "Invalid code"}
            }

            if(twoFactorToken.token !== code){
                return {error : "Invalid code"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired) {
                return {error : "code expired"};
            }

            await db.twoFactorToken.delete({
                where:{id: twoFactorToken.id}
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {id : existingConfirmation.id}
                });
            }

            await db.twoFactorConfirmation.create({
                data:{
                    userId: existingUser.id,
                }
            })


        }else{
         
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);

            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            )
    
            return {twoFactor : true};
        }
    }


    try {
        await signIn("credentials",{
            email,
            password,
            redirectTo: callbackUrl ||  DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return{error : "invalid credentials!"};
                default:
                    return {error : "something went wrong!"};
            }
        }
        throw error;
    }

}