import { db } from "@/lib/db";
    

export const getPaswordResetTokenByToken= async(token) => {
    

    try {
        
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: {token}
        });

        return passwordResetToken;

    } catch {
        return null;
    }

}

export const getPaswordResetTokenByEmail = async(email) => {
    

    try {
        
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: {email}
        });

        return passwordResetToken;

    } catch {
        return null;
    }

}