import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 
import { connectionToDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "e.g jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials){
            
                if(!credentials?.username || !credentials?.password){
                    throw new Error("Missing credentials")
                }
                 
                
                try {
                    await connectionToDB()
                    const user = await User.findOne({email: credentials.username})

                    if (!user){
                        throw new Error("No user found")
                    }

                    const isMatched = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if(!isMatched){
                        throw new Error("invalid password")
                    }
                    return {
                        id: user._id.toString(),
                        email: user.emial
                    }

                } catch (error) {
                    throw error
                }
            }
        })
    ],
    callbacks: {    
        async jwt({ token, user }: { token: any; user?: any }) {
            if(user){
                token.id= user.id
            }
            return token;
        }
        ,
    async session({ session, token }: { session: any; token: any }) {
        if (session.user) {
            session.user.id = token.id as string;
        }
        return session;
    }
    
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session:{ 
        strategy: "jwt",
        maxAge: 30*24*60*60
    },
    secret: process.env.NEXTAUTH_SECRET
}