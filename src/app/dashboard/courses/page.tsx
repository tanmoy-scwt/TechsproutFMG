import { Separator } from "@/components/ui/separator";
import { SubscriptionDetailsSection } from "../_components";
import { SubscriptionDetailsSectionData } from "../_components/subscription-details-section";
import { CoursesTitleSection, CoursesListingSection } from "./_components";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import Loading from "@/components/loading";
import { ClientFetch } from "@/actions/client-fetch";

async function CoursesPage({ searchParams }: any) {
   const session = await auth();
   const { page, filter } = searchParams;
   const key = page + filter;
   let url = `${process.env.API_URL}/user/course/listing?user_id=${session?.user.userId}`;
   if (page) url += `&page=${page}`;
   if (filter) url += `&filter=${filter}`;
   const res = await ClientFetch(url, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 5, tags: ["userCoursesListing"] },
   });

   const resp = await res.json();
   const { total, per_page, current_page, data } = resp.data;
   const subscriptionUrl = `${process.env.API_URL}/user/subscriptions/details/${session?.user.userId}`;
   const subRes = await ClientFetch(subscriptionUrl, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
   });

   const subsResp: SubscriptionDetailsSectionData = await subRes.json();
   console.log("subsc data", subsResp);
   return (
      <div className="dash-bg">
         <SubscriptionDetailsSection data={subsResp} />
         <Separator />
         <CoursesTitleSection />
         <Suspense fallback={<Loading />} key={key}>
            <CoursesListingSection total={total} per_page={per_page} current_page={current_page} data={data} />
         </Suspense>
      </div>
   );
}

export default CoursesPage;
