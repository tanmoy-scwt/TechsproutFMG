import { PotentialStudentsListingTable } from "@/app/dashboard/_components";
import { PotentialStudentsListingTableData } from "@/app/dashboard/_components/potential-students-listing-table";
import DynamicPagination from "@/components/dynamic-pagination";

interface PotentialStudentsListingSectionProps {
   data: PotentialStudentsListingTableData;
   total: number;
   per_page: number;
   current_page: number;
   remaining_coin : number;
   last_coin_purchase_date : string;
   unlock_coin_no : number;
}
function PotentialStudentsListingSection({ total, per_page, current_page, data, remaining_coin, last_coin_purchase_date, unlock_coin_no }: PotentialStudentsListingSectionProps) {
   return (
      <>
         <section>
            <PotentialStudentsListingTable data={data} remaining_coin={remaining_coin} last_coin_purchase_date={last_coin_purchase_date} unlock_coin_no={unlock_coin_no} />
         </section>
         <section>
         {total > 0 && (
            <section>
               <DynamicPagination total={total} perPage={per_page} currentPage={current_page} urlParamOnChange="page" />
            </section>
         )}
         </section>
      </>
   );
}

export default PotentialStudentsListingSection;
