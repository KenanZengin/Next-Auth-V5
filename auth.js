import NextAuth from "next-auth";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const {
    handlers: {GET, POST},
    auth,
} = NextAuth({
    adapter:PrismaAdapter(db),
    session:{strategy:"jwt"}
    ,
    ...authConfig
})