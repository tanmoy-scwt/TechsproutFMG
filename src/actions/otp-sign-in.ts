"use server";

import { signIn } from "@/lib/auth";

export const SendSignInOTP = async (phone: string) => {
   try {
      const res = await fetch(`${process.env.API_URL}/send-phone-otp`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            phone,
         }),
         cache: "no-cache",
      });
      return res.json();
   } catch (error) {
      throw error;
   }
};

export interface MobileSignInActionArgs {
   phone: string;
   otp: string;
}

export const MobileSignInAction = async (data: MobileSignInActionArgs) => {
   try {
      await signIn("mobile", {
         ...data,
         redirect: false,
      });
      return { status: true, message: "" };
   } catch (error: any) {
      return { status: false, message: error.message };
   }
};
