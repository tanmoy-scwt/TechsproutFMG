import React, { Suspense } from "react";
import { SubscriptionHistorySection, SubscriptionHistoryTableSection } from "./_components";
import { format } from "date-fns";
import { SubscriptionHistoryTableData } from "../_components/subscription-history-table";
import { auth } from "@/lib/auth";
import { ClientFetch } from "@/actions/client-fetch";
import Loading from "@/components/loading";

async function SubscriptionHistoryPage() {
   const session = await auth();
   const url = `${process.env.API_URL}/user/subscriptions/history/${session?.user.userId}`;

   const res = await ClientFetch(url, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 0, tags: ["subscriptionListing"] },
   });

   const resp = await res.json();
   //console.log("resp",resp);
   const { total, per_page, current_page, data } = resp?.data?.packageHistory;

   const tableData: SubscriptionHistoryTableData = data;
   //    console.log("resp?.data?.currentPackageDetails", resp?.data?.currentPackageDetails);

   return (
      <div className="dash-bg">
         {/* <SubscriptionHistorySection
            title="Current Subscription Package: "
            content={resp?.data?.currentPackageDetails?.current_package}
         /> */}
         {/* {format(new Date(resp?.data?.currentPackageDetails?.end_date), "dd/MM/yyyy, HH:MM:SS a")} */}
         <SubscriptionHistorySection title={resp?.data?.currentPackageDetails?.current_package} enddate={resp?.data?.currentPackageDetails?.end_date} />
         <Suspense fallback={<Loading />}>
            <SubscriptionHistoryTableSection
               data={tableData}
               total={total}
               per_page={per_page}
               current_page={current_page}
            />
         </Suspense>
      </div>
   );
}

export default SubscriptionHistoryPage;
