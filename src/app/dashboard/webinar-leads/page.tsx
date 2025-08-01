import { auth } from "@/lib/auth";
import { WebinarLeadsFilterSection, WebinarLeadsListingSection } from "./_components";
import { ClientFetch } from "@/actions/client-fetch";
import { Suspense } from "react";
import Loading from "@/components/loading";

async function StudentLeadsPage({ searchParams }: any) {
   const session = await auth();
   const { start_date, end_date } = searchParams;
   const sParams = new URLSearchParams(searchParams);

   const key = sParams.toString();
   let url = `${process.env.API_URL}/user/webinar/lead/${session?.user.userId}`;

   if (sParams) {
      if (!start_date || !end_date) {
         sParams.delete("start_date");
         sParams.delete("end_date");
      }
      url += `?${sParams}`;
   }

   const res = await ClientFetch(url, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 0, tags: ["webinarLeadsListing"] },
   });

   const resp = await res.json();
   const { total, per_page, current_page, data } = resp?.data;

   return (
      <div className="dash-bg">
         <h1 className="subtitle">Webinar Leads</h1>
         <WebinarLeadsFilterSection />
         <Suspense fallback={<Loading />} key={key}>
            <WebinarLeadsListingSection total={total} per_page={per_page} current_page={current_page} data={data} />
         </Suspense>
      </div>
   );
}

export default StudentLeadsPage;
