"use server" 

import * as z from "zod"
import bcrypt from "bcrypt"
import { RegisterSchema } from "@/schema";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values) => { 
    console.log(values);
    const validateFields = RegisterSchema.safeParse(values);

    if(!validateFields.success){
        return{error:"Invalid fields"}
    }

    const {email,password,name} = validateFields.data
    const hashPassword = await bcrypt.hash(password,10)

    const existingUser = await getUserByEmail(email)

    if(existingUser){
        return { error : "Eamil aldready in use!"}
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashPassword
        }
    })

    //Todo : send verifitication token email

    return{success: "User created"}


}