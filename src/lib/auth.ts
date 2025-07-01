import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { links } from "./constants";
import { CustomAuthError } from "./auth-error";

export const { handlers, signIn, signOut, auth } = NextAuth({
   providers: [
      CredentialsProvider({
         name: "credentials",
         async authorize(credentials) {
            try {
               const res = await fetch(`${process.env.API_URL}/login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(credentials),
                  cache: "no-cache",
               });

               const result = await res.json();

               if (!result?.status || !result?.data?.token) {
                  throw new CustomAuthError(result);
               }
               const { data } = result;

               return {
                  fullName: data.f_name,
                  token: data.token,
                  tokenExpiry: data.token_expiration_time,
                  email: data.email,
                  profilePicture: data.profile_pic,
                  userType: data.user_type,
                  userId: data.user_id,
                  provider: "Credentials",
               };
            } catch (error) {
               throw error;
            }
         },
      }),
      CredentialsProvider({
         id: "mobile",
         name: "mobile",
         async authorize(credentials) {
            try {
               const res = await fetch(`${process.env.API_URL}/otp-login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                     phone: credentials.phone,
                     otp: credentials.otp,
                  }),
                  cache: "no-cache",
               });

               const result = await res.json();

               if (!result?.status || !result?.data?.token) {
                  throw new CustomAuthError({
                     status: result?.status,
                     message: result.message || "Login failed",
                  });
               }
               const { data } = result;

               return {
                  fullName: data.f_name,
                  token: data.token,
                  tokenExpiry: data.token_expiration_time,
                  email: data.email,
                  profilePicture: data.profile_pic,
                  userType: data.user_type,
                  userId: data.user_id,
                  provider: "Mobile",
               };
            } catch (error) {
               throw error;
            }
         },
      }),
   ],
   callbacks: {
      jwt: async ({ token, user, account, trigger, session }) => {
         try {
            if (user) {
               token = { ...token, ...user };
            }
         } catch (error) {
            return null;
         }

         if (account?.provider) {
            token.provider = account.provider;
         }
         if (trigger === "update") {
            token = { ...token, ...session };
         }

         return token;
      },
      session: async ({ session, token }) => {
         session.user = token as any;
         return session;
      },
   },
   session: {
      maxAge: 86400, // converting seconds in minutes. 60*30 means 60 sesconds means 1 min.  30 means 30 minutes
   },
   pages: {
      signIn: links.signIn,
   },
   secret: process.env.AUTH_SECRET,
   cookies: {
      pkceCodeVerifier: {
         name: "next-auth.pkce.code_verifier",
         options: {
            httpOnly: true,
            sameSite: "none",
            path: "/",
            secure: true,
         },
      },
   },
});
