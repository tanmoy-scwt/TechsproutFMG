import CoursesListingTable, { CoursesListingTableData } from "@/app/dashboard/_components/courses-listing-table";
import DynamicPagination from "@/components/dynamic-pagination";

interface CoursesListingSectionProps {
   data: CoursesListingTableData[];
   total: number;
   per_page: number;
   current_page: number;
}

function CoursesListingSection({ total, per_page, current_page, data }: CoursesListingSectionProps) {
   const coursesListingData: CoursesListingTableData = data?.map((item: any, idx: number) => ({
      id: item.id,
      sl: (current_page - 1) * per_page + idx + 1,
      title: item?.course_name,
      category: item?.category_name,
      image: item?.course_logo,
      previewImage: item?.course_logo_preview,
      skills: item?.skills?.split(","),
      status: item?.status,
   }));

   return (
      <>
         <section>
            <CoursesListingTable data={coursesListingData} />
         </section>
         {total > per_page && (
            <section>
               <DynamicPagination total={total} perPage={per_page} currentPage={current_page} urlParamOnChange="page" />
            </section>
         )}
      </>
   );
}

export default CoursesListingSection;
