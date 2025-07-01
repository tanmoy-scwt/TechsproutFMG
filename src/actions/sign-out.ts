"use server";

import { signOut } from "@/lib/auth";

export const SignOutAction = async (redirect = true, redirectTo = "/") => {
   await signOut({
      redirectTo,
      redirect,
   });
};
