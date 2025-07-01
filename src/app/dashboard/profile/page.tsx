import { auth } from "@/lib/auth";
import { ProfileDetailsSection } from "./_components";
import { UserProfile } from "./_types";
import { ClientFetch } from "@/actions/client-fetch";
import { cookies } from "next/headers";
async function ProfilePage() {
   const session = await auth();
   const cookieStore = cookies();
   const profileComplete = cookieStore.get("profile_complete")?.value;
   const courseExists = cookieStore.get("ifAnyCourseExists")?.value;
   const subscriptionTaken = cookieStore.get("ifAnySubscriptionTakenTillNow")?.value;
   console.log("profileComplete", profileComplete);
   console.log("courseExists", courseExists);
   console.log("subscriptionTaken", subscriptionTaken);

   const res = await ClientFetch(`${process.env.API_URL}/user/view-profile/${session?.user.userId}`, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 5, tags: ["profileDetails"] },
   });

   const profileData: UserProfile = (await res.json())?.data;

   return <ProfileDetailsSection data={profileData} session={session} profileCompleteMiddleware={profileComplete} />;
}

export default ProfilePage;
