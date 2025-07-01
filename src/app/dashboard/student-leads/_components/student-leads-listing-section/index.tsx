import { StudentLeadsTable } from "@/app/dashboard/_components";
import { StudentLeadsTableData } from "@/app/dashboard/_components/student-leads-table";
import DynamicPagination from "@/components/dynamic-pagination";
import React from "react";

interface StudentLeadsListingSectionProps {
   data: StudentLeadsTableData;
   total: number;
   per_page: number;
   current_page: number;
}
function StudentLeadsListingSection({ total, per_page, current_page, data }: StudentLeadsListingSectionProps) {
   const leadsData: StudentLeadsTableData = data?.map((item: any, idx: number) => ({
      id: item.id,
      sl: idx + 1,
      enquiryDate: item?.created_at,
      studentName: item?.student_name,
      email: item?.student_email,
      phone: item?.student_phone,
      message: item?.student_message,
      remarks: item?.tutor_notes,
      enquiryCourse: item?.course_name,
   }));

   return (
      <>
         <section>
            <StudentLeadsTable data={leadsData} />
         </section>
         <section>
            {total > 0 && (
               <section>
                  <DynamicPagination
                     total={total}
                     perPage={per_page}
                     currentPage={current_page}
                     urlParamOnChange="page"
                  />
               </section>
            )}
         </section>
      </>
   );
}

export default StudentLeadsListingSection;
