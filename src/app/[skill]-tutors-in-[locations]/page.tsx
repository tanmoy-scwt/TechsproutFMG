import "./style.css";
import CourseCard, { CourseCardContent } from "@/components/course-card";
import { FilterSearch } from "./_components";
import { ClientFetch } from "@/actions/client-fetch";
import DynamicPagination from "@/components/dynamic-pagination";
import { notFound } from "next/navigation";

async function CoursesPage({ params, searchParams }: any) {
   const { page, search_key, mode, batch, rating, sortby, t, location } = searchParams;

   const combinedValue = params["skill]-tutors-in-[locations"];

   // Split the value to extract skill and location
//    const [skill, , , locations] = combinedValue.split("-");
//     console.log(skill,locations);
    const parts = combinedValue.split("-");

    // Skill is everything before "tutors-in"
    const skillIndex = parts.indexOf("tutors");
    const skill = parts.slice(0, skillIndex).join("-");

    // Location is everything after "tutors-in"
    const locations = parts.slice(skillIndex + 2).join("-");

    if(!skill || !locations){
        notFound();
    }

   let url = `${process.env.API_URL}/course/listing`;
   const param = new URLSearchParams();
   if (page) param.append("page", page);
   if (skill) param.append("skill", skill?.replace(/-/g, " "));
   if (search_key) param.append("course_name", search_key?.replace(/-/g, " "));
   if (locations !== "online" && !location) {
      param.append("location", locations);
   }
   if (locations == "online") {
      param.append("teaching_mode", "Online");
   }
   if (location) {
      param.append("location", location);
   }
   if (mode) param.append("teaching_mode", mode);
   // if (t == 2){
   //     param.append("teaching_mode", "Online");
   // }else{
   //     param.append("teaching_mode", "Offline");
   // }
   if (batch) param.append("batch_type", batch);
   if (rating) param.set("rating", rating);
   if (sortby) param.set("sortby", sortby);
   url += `?${param.toString()}`;
   console.log(url);

   const res = await ClientFetch(url, { cache: "no-store" });
   const courseList = await res.json();

//    const { total, per_page, current_page } = courseList?.data;
   const { total, per_page, current_page } = courseList?.data ?? {};

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
            findmode={locations}
            skillname={skill}
         >
            <div className="course-page__courses">
               {Courses?.length > 0 ? (
                  Courses.map((course) => <CourseCard content={course} key={course.id} />)
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
