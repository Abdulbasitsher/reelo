import NextAuth from "next-auth"
declare module "next-auth"{
    interface Session {
        id: {user: string} & DefaultSession ["user"]
    }
}