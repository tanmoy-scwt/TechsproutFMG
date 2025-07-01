import { ClientFetch } from "@/actions/client-fetch";
import { PotentialStudentsListingTableData } from "../_components/potential-students-listing-table";
import { PotentialStudentsListingSection, PotentialStudentsSearchFilterSection } from "./_components";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import Loading from "@/components/loading";

async function PotentialStudentsPage({ searchParams }: any) {
   const session = await auth();
   let url = `${process.env.API_URL}/user/course/potential-lead/${session?.user.userId}`;

   const { search_key } = searchParams;
   const sParams = new URLSearchParams(searchParams);
   const key = sParams.toString();

   if (sParams) {
      if (!search_key) {
         sParams.delete("search_key");
      }
      url += `?${sParams}`;
   }

   const res = await ClientFetch(url, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 5, tags: ["potentialLeadsListing"] },
   });

   const resp = await res.json();
   //console.log("poten",resp);
   const { total, per_page, current_page, data } = resp?.data?.potentialLeads;
   const remainingCoin = resp?.data?.remainingCoins;
   const lastCoinPurchaseDate = resp?.data?.lastCoinPurchaseDate;
   const leadUnlockCoins = resp?.data?.leadUnlockCoins;

   const studentsList: PotentialStudentsListingTableData = data;
   //console.log("studentsList", studentsList);
   return (
      <div className="dash-bg">
         <section className="flex flex-col gap-[15px]">
            <h1 className="subtitle">Potential Students</h1>
            <p className="label">Discover Students actively Seeking Tutors Like You!</p>
         </section>
         <PotentialStudentsSearchFilterSection />
         <Suspense fallback={<Loading />} key={key}>
            <PotentialStudentsListingSection
               remaining_coin={remainingCoin}
               last_coin_purchase_date={lastCoinPurchaseDate}
               unlock_coin_no={leadUnlockCoins}
               data={studentsList}
               total={total}
               per_page={per_page}
               current_page={current_page}
            />
         </Suspense>
      </div>
   );
}

export default PotentialStudentsPage;
