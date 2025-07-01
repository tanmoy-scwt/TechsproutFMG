import { SubscriptionHistoryTable } from "@/app/dashboard/_components";
import { SubscriptionHistoryTableData } from "@/app/dashboard/_components/subscription-history-table";
import DynamicPagination from "@/components/dynamic-pagination";

interface SubscriptionHistoryTableSectionProps {
   data: SubscriptionHistoryTableData;
   total: number;
   per_page: number;
   current_page: number;
}
function SubscriptionHistoryTableSection({
   data,
   total,
   per_page,
   current_page,
}: SubscriptionHistoryTableSectionProps) {
   return (
      <section className="flex flex-col gap-[15px] mt-4">
         <h1 className="dash-subtitle">History</h1>
         <SubscriptionHistoryTable data={data} />

         {total > 0 && (
            <section>
               <DynamicPagination total={total} perPage={per_page} currentPage={current_page} urlParamOnChange="page" />
            </section>
         )}
      </section>
   );
}

export default SubscriptionHistoryTableSection;
