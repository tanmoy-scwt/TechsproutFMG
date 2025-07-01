"use server";

import { signIn } from "@/lib/auth";

export interface EmailSignInActionArgs {
   email: string;
   password: string;
}

export const EmailSignInAction = async (data: EmailSignInActionArgs) => {
   try {
      await signIn("credentials", {
         ...data,
         redirect: false,
      });
      return { status: true, message: "" };
   } catch (error: any) {
      return {
         status: false,
         message:
            error.message === "Unauthorised access." ? "Invalid email or password. Please try again." : error.message,
      };
   }
};
