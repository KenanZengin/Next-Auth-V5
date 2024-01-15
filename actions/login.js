"use server" //işi garantiye almak için server kullanıyoruz

import * as z from "zod"
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values) => { // login formundan aldığımız verileri serverde işleme alıyoruz
    console.log(values);
    const validateFields = LoginSchema.safeParse(values);

    if(!validateFields.success){
        return{error:"Invalid fields"}
    }

    const {email, password} = validateFields.data;
    
    try {
        await signIn("credentials",{
            email,
            password,
            redirectTo:  DEFAULT_LOGIN_REDIRECT
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