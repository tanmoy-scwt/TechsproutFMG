import { UserType } from "@/types";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
   /**
    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    */
   interface Session {
      user: {
         /** User data from backend */
         profilePicture: string;
         fullName: string;
         token: string;
         tokenExpiry: string;
         email: string;
         userType: UserType;
         userId: number;
         provider: string;
      } & DefaultSession["user"];
   }
}
