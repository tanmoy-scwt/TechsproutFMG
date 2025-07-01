import WebinarCard, { WebinarCardContent } from "@/components/webinar-card";
import { FilterSearch, ListingsContainer } from "../_components";
import { ClientFetch } from "@/actions/client-fetch";
import DynamicPagination from "@/components/dynamic-pagination";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
   const res = await ClientFetch(`${process.env.API_URL}/seo-details/webinarListing`, { cache: "no-store" });
   const metadata = await res.json();

   return {
      title: metadata?.data?.mete_title,
      description: metadata?.data?.meta_description,
      keywords: metadata?.data?.meta_keyword,
   };
}

async function WebinarsPage({ searchParams }: any) {
   const { page, search_key, location, mode, batch, rating, sortby, startdate, enddate } = searchParams;

   let url = `${process.env.API_URL}/webinar/listing`;

   const params = new URLSearchParams();
   if (page) params.append("page", page);
   if (search_key) params.append("webinar_title", search_key);
   if (location) params.append("location", location);
   if (mode) params.append("teaching_mode", mode);
   if (batch) params.append("batch_type", batch);
   if (rating) params.set("rating", rating);
   if (sortby) params.set("sortby", sortby);
   if (startdate) params.set("start_date", startdate);
   if (enddate) params.set("end_date", enddate);
   url += `?${params.toString()}`;

   const res = await ClientFetch(url, { cache: "no-store" });
   const webinarList = await res.json();

   const { total, per_page, current_page } = webinarList?.data;

   const filterres = await ClientFetch(`${process.env.API_URL}/locationListing/tutor`, {
      cache: "no-store",
   });
   const filterDataList = await filterres.json();

   const Webinars: Array<WebinarCardContent> = webinarList?.data?.data;

   //    const suggestions: Array<{ id: string | number; name: string }> = [
   //       { id: 1, name: "UI/UX Design" },
   //       { id: 2, name: "Frontend Development" },
   //       { id: 3, name: "Backend Development" },
   //       { id: 4, name: "Full-Stack Development" },
   //       { id: 5, name: "Android Development" },
   //       { id: 6, name: "iOS Development" },
   //    ];

   const filtertype = "webinar";

   return (
      <main>
         <FilterSearch
            filtertype={filtertype}
            filterdata={filterDataList?.data}
            suggestions={[]}
            location={location}
            searchskill={search_key}
            t={""}
            totalResults={total}
         >
            <ListingsContainer>
               {Webinars?.length > 0 ? (
                  Webinars?.map((webinar) => <WebinarCard content={webinar} key={webinar.id} />)
               ) : (
                  <div className="webinar_null">No Webinar Found</div>
               )}
            </ListingsContainer>
            {total > per_page && (
               <section>
                  <DynamicPagination
                     total={total}
                     perPage={per_page}
                     currentPage={current_page}
                     urlParamOnChange="page"
                  />
               </section>
            )}
         </FilterSearch>
      </main>
   );
}

export default WebinarsPage;
