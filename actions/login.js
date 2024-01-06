"use server" //işi garantiye almak için server kullanıyoruz

import * as z from "zod"
import { LoginSchema } from "@/schema";

export const login = async (values) => { // login formundan aldığımız verileri serverde işleme alıyoruz
    console.log(values);
    const validateFields = LoginSchema.safeParse(values);

    if(!validateFields.success){
        return{error:"Invalid fields"}
    }

    return{success: "Email sent"}


}