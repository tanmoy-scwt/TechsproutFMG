import { Separator } from "@/components/ui/separator";
import { SubscriptionDetailsSection } from "../_components";
import { WebinarsListingTableData } from "../_components/webinars-listing-table";
import { SubscriptionDetailsSectionData } from "../_components/subscription-details-section";

import { WebinarsTitleSection, WebinarsListingSection } from "./_components";
import { auth } from "@/lib/auth";
import { ClientFetch } from "@/actions/client-fetch";
import { Suspense } from "react";
import Loading from "@/components/loading";

async function WebinarsPage({ searchParams }: any) {
   const session = await auth();
//    const subscriptionData: SubscriptionDetailsSectionData = {
//       data: {
//          last_recharge: "2024-11-04T06:56:32.862Z",
//          remainingCoins: 500,
//          expiry_date: "2024-12-04T06:56:32.862Z",
//          package_name: "Premium",
//          status: "Active",
//       },
//    };

interface SubscriptionDetailsSectionData {
    //    data: { package_name: string; last_recharge: string; expiry_date: string; remainingCoins: number; status: string };
            data: {
                f_name: string;
                user_type: string;
                currentSubscription: {
                subscription_purchase_id: number;
                package_name: string;
                last_recharge: string;
                expiry_date: string;
                };
                remainingCoins: number;
                status: string;
                upComingSubscriptionDtls?: {
                subscription_purchase_id: number;
                package_name: string;
                last_recharge: string;
                expiry_date: string;
                start_date: string;
                };
            };
        }

   const { page, filter } = searchParams;
   const key = page + filter;
   //user_id is not necessary
   let url = `${process.env.API_URL}/user/webinar/listing/${session?.user.userId}?user_id=${session?.user.userId}`;
   if (page) url += `&page=${page}`;
   if (filter) url += `&filter=${filter}`;

   const res = await ClientFetch(url, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 5, tags: ["userWebinarsListing"] },
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

   return (
      <div className="dash-bg">
         <SubscriptionDetailsSection data={subsResp} />
         <Separator />
         <WebinarsTitleSection />
         <Suspense fallback={<Loading />} key={key}>
            <WebinarsListingSection total={total} per_page={per_page} current_page={current_page} data={data} />
         </Suspense>
      </div>
   );
}

export default WebinarsPage;
