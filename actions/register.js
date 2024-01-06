"use server" 

import * as z from "zod"
import { RegisterSchema } from "@/schema";

export const register = async (values) => { 
    console.log(values);
    const validateFields = RegisterSchema.safeParse(values);

    if(!validateFields.success){
        return{error:"Invalid fields"}
    }

    return{success: "Email sent"}


}