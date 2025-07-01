"use server";

import { revalidatePath } from "next/cache";

export const RevalidatePath = (path: string, type?: "page" | "layout") => {
   revalidatePath(path, type);
};
