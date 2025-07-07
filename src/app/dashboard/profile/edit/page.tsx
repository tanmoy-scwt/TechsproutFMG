import React from "react";
import { EditProfileForm } from "./_components";
import { UserProfile } from "../_types";
import { auth } from "@/lib/auth";
import { ClientFetch } from "@/actions/client-fetch";
import { cookies } from "next/headers";

async function EditProfilePage() {
   const session = await auth();
   const cookieStore = cookies();
   const SubscriptionTakenTillNow = cookieStore.get("ifAnySubscriptionTakenTillNow")?.value;
   const CourseExists = cookieStore.get("ifAnyCourseExists")?.value;

   const res = await ClientFetch(`${process.env.API_URL}/user/view-profile/${session?.user.userId}`, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 5, tags: ["profileDetails"] },
   });

   const profileData: UserProfile = (await res.json())?.data;

   return <EditProfileForm data={profileData} SubscriptionTakenTillNow={SubscriptionTakenTillNow} CourseExists={CourseExists} />;
}

export default EditProfilePage;
