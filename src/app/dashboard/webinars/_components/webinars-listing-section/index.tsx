import WebinarsListingTable, { WebinarsListingTableData } from "@/app/dashboard/_components/webinars-listing-table";
import DynamicPagination from "@/components/dynamic-pagination";

interface WebinarsListingSectionProps {
   data: Array<any>;
   total: number;
   per_page: number;
   current_page: number;
}

function WebinarsListingSection({ total, per_page, current_page, data }: WebinarsListingSectionProps) {
   const webinarData: WebinarsListingTableData = data?.map((item: any, idx: number) => ({
      sl: idx + 1,
      id: item.id,
      title: item?.title,
      category: item?.category_name,
      date: item?.start_date,
      startTime: item?.start_time,
      endTime: item?.end_time,
      status: item?.status,
   }));

   return (
      <>
         <section>
            <WebinarsListingTable data={webinarData} />
         </section>

         {total > per_page && (
            <section>
               <DynamicPagination total={total} perPage={per_page} currentPage={current_page} urlParamOnChange="page" />
            </section>
         )}
      </>
   );
}

export default WebinarsListingSection;
