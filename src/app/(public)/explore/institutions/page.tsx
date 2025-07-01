import { FilterSearch, ListingsContainer } from "../_components";
import InstituteCard, { InstituteCardContent } from "@/components/institute-card";
import { ClientFetch } from "@/actions/client-fetch";
import DynamicPagination from "@/components/dynamic-pagination";

async function InstitutionsPage({searchParams}:any) {

    const { page, search_key, location, mode, batch, rating, sortby } = searchParams;

    let url = `${process.env.API_URL}/institute/listing`;

    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (search_key) params.append("institute_name", search_key);
    if (location) params.append("location", location);
    if (mode) params.append("teaching_mode", mode);
    if (batch) params.append("batch_type", batch);
    if (rating) params.set("rating", rating);
    if (sortby) params.set("sortby", sortby);
    url += `?${params.toString()}`;

    const res = await ClientFetch(url, { cache: "no-store" });
    const instituteList = await res.json();

    const { total, per_page, current_page  } = instituteList?.data;

    const filterres = await ClientFetch(`${process.env.API_URL}/locationListing/course`, {
        cache: "no-store",
    });
    const filterDataList = await filterres.json();

   const filtertype = "institute";

   const Institutes: Array<InstituteCardContent> = instituteList?.data;

//    const suggestions: Array<{ id: string | number; name: string }> = [
//       { id: 1, name: "UI/UX Design" },
//       { id: 2, name: "Frontend Development" },
//       { id: 3, name: "Backend Development" },
//       { id: 4, name: "Full-Stack Development" },
//       { id: 5, name: "Android Development" },
//       { id: 6, name: "iOS Development" },
//    ];

   return (
      <main>
         <FilterSearch filtertype={filtertype} filterdata={filterDataList?.data} suggestions={[]} searchskill={search_key} location={location} t={""} totalResults={total}>
            <ListingsContainer>
            {Institutes?.length > 0 ? (
            Institutes?.map((inst) => (
                <InstituteCard content={inst} key={inst.id} />
            ))
            ) : null}
            </ListingsContainer>
            {total > per_page && (
                <section>
                <DynamicPagination total={total} perPage={per_page} currentPage={current_page} urlParamOnChange="page" />
                </section>
            )}
         </FilterSearch>
      </main>
   );
}

export default InstitutionsPage;
