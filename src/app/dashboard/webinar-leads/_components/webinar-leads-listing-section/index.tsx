import { WebinarLeadsTable } from "@/app/dashboard/_components";
import { WebinarLeadsTableData } from "@/app/dashboard/_components/webinar-leads-table";
import DynamicPagination from "@/components/dynamic-pagination";
import { Session } from "next-auth";
import React from "react";

interface WebinarLeadsListingSectionProps {
   data: WebinarLeadsTableData;
   total: number;
   per_page: number;
   current_page: number;
}
function WebinarLeadsListingSection({ total, per_page, current_page, data }: WebinarLeadsListingSectionProps) {
   const leadsData: WebinarLeadsTableData = data?.map((item: any, index: number) => ({
      sl: index + 1,
      id: item.id,
      title: item?.webinar_title,
      studentName: item?.student_name,
      email: item?.student_email,
      phone: item?.student_phone,
      message: item?.student_message,
      remarks: item?.tutor_notes,
      enquiryDate: item?.created_at,
      webinarTitle: item?.webinar_title,
   }));

   return (
      <>
         <section>
            <WebinarLeadsTable data={leadsData} />
         </section>
         {total > 0 && (
            <section>
               <DynamicPagination total={total} perPage={per_page} currentPage={current_page} urlParamOnChange="page" />
            </section>
         )}
      </>
   );
}

export default WebinarLeadsListingSection;
