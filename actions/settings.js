"use server"

import { db } from "@/lib/db"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"

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

    const existingUser = await getUserByEmail(values.email)

    if (values.email === existingUser.email) {
        return {error : "Email already in use"}
    }

    await db.user.update({
        where: {id : dbUser.id},
        data:{
            email:values.email,
            password:values.newPassword,
            isTwoFactorEnabled:values.isTwoFactorEnabled
        }
    })

    return {success : "Settings Update!"};


}