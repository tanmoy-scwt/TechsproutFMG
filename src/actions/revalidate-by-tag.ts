"use server";

import { revalidateTag } from "next/cache";

export const revalidateByTag = (tag: string) => {
  revalidateTag(tag);
};
