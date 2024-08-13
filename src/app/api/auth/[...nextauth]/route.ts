import NextAuth from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcrypt"
export const OPTIONS: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const response = await fetch("http://localhost:3001/login/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: credentials?.username,password:credentials?.password}),
                });

                const data = await response.json();
     
                // const user = { name: "chibwwi", id: 3, firstName: "chibrajjj", email: credentials?.username };
                
                console.log(data);
                if (response.ok && data) {
                    return data; 
                } 
                else{

                    return null; 
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstName = user.firstName; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.firstName = token.firstName;
          }
          return session;
        },
      },
    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        brandColor: "", // Hex color code
        logo: "https://actlogica.com/wp-content/uploads/2018/04/landing-page1200x400.png",
        buttonText: "" // Hex color code
      },
    //   pages: {
    //     signIn: 'api/auth/signin/',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    //   }
    pages:{
        newUser: 'api/auth/newUser'
    }

}
const handler =NextAuth(OPTIONS)

export {handler as GET, handler as POST}