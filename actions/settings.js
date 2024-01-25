"use server"

import { db } from "@/lib/db"
import { update } from "@/auth"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { compare, hash } from "bcrypt"

export const settings = async(values) => {
    const user = await currentUser();

    if(!user){
        return {error : "Unauthorized"};
    }

    const dbUser = await getUserById(user.id);

    if(!dbUser){
        return {error: "Unauthorized"};
    }

    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    console.log("password,newpassword,dbpassword",values.password,values.newPassword,dbUser.password);
    if (values.email && values.email !==user.email) {

       const existingUser = await getUserByEmail(values.email);
        if(values.email == existingUser?.email){
            return {error : "Email already in use!"}
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return {success : "Verificatio email send"}
    }
   
    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await compare(values.password,dbUser.password);
        if(!passwordMatch){
            return {error : "Incorret password"}
        } 
        
        const hashPassword = await hash(values.newPassword,10);

        values.password = hashPassword;
        values.newPassword = undefined;
    }

    const updatedUser = await db.user.update({
        where: {id : dbUser.id},
        data:{
            name : values.name,
            email:values.email,
            password:values.password,
            isTwoFactorEnabled:values.isTwoFactorEnabled,
            role: values.role
        }
    });

    update({
        user : {
            name : updatedUser.name,
            email : updatedUser.email,
            isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
            role : updatedUser.role,
        }
    });

    return {success : "Settings Update!"};


}