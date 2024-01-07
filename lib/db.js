import { PrismaClient } from "@prisma/client";

// export const db = globalThis.prisma || new PrismaClient()

// if(process.env.NODE_ENV !== "production"){
//     globalThis.prisma = db
// }


export const db = new PrismaClient()

//production için db = new PrismaClient() yeterli fakat developmenta yukardakini yapmalıyız