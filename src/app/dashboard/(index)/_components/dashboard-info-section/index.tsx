import "./style.css";
import { DashboardInfoCard } from "../../_components";
import { DashboardInfoItem } from "../../types";

interface DashboardInfoSectionProps {
   data: Array<DashboardInfoItem>;
}
function DashboardInfoSection({ data }: DashboardInfoSectionProps) {
   return (
      <section>
         <div className="dis__cards--container">
            {data.map((item, index) => (
               <DashboardInfoCard data={item} key={index} className="dis__card" />
            ))}
         </div>
      </section>
   );
}

export default DashboardInfoSection;
