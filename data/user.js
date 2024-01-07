import { db } from "@/lib/db";

export const getUserByEmail = async(email) => {

    try{
        const user = await db.user.findUnique({where:{email}});

        return user

    }catch{
        return null
    }

}

export const getUserById = async(id) => {

    try{
        const id = await db.user.findUnique({where:{id}});

        return id

    }catch{
        return null
    }

}