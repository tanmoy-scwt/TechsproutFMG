import "./style.css";
import CourseCard, { CourseCardContent } from "@/components/course-card";
import { FilterSearch } from "../_components";
import { ClientFetch } from "@/actions/client-fetch";
import DynamicPagination from "@/components/dynamic-pagination";

async function CoursesPage({ searchParams }: any) {
   const { page, search_key, location, mode, batch, rating, sortby, t } = searchParams;

   let url = `${process.env.API_URL}/course/listing`;

   const params = new URLSearchParams();
   if (page) params.append("page", page);
   if (search_key) params.append("course_name", search_key);
   if (location) params.append("location", location);
   if (mode) params.append("teaching_mode", mode);
   if (t) params.append("t", t);
   if (batch) params.append("batch_type", batch);
   if (rating) params.set("rating", rating);
   if (sortby) params.set("sortby", sortby);
   url += `?${params.toString()}`;
   console.log(url);

   const res = await ClientFetch(url, { cache: "no-store" });
   const courseList = await res.json();

   const { total, per_page, current_page } = courseList?.data;

   const filterres = await ClientFetch(`${process.env.API_URL}/locationListing/course`, {
      cache: "no-store",
   });
   const filterDataList = await filterres.json();

   const Courses: Array<CourseCardContent> = courseList?.data?.data;

   const suggestions: Array<{ id: string | number; name: string }> = courseList?.suggestions;

   const filtertype = "course";

   return (
      <main>
         <FilterSearch
            filtertype={filtertype}
            filterdata={filterDataList?.data}
            suggestions={suggestions}
            location={location}
            searchskill={search_key}
            t={t}
            totalResults={total}
         >
            <div className="course-page__courses">
               {Courses?.length > 0 ? (
                  Courses?.map((course) => <CourseCard content={course} key={course.id} />)
               ) : (
                  <p className="nodata">No courses available.</p>
               )}
            </div>
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

export default CoursesPage;
