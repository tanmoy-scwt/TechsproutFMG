import "./style.css";

import Image from "next/image";
import { DashboardInfoItem } from "../../types";

interface DashboardInfoCardProps {
   className?: string;
   data: DashboardInfoItem;
}

function DashboardInfoCard({ data, className = "" }: DashboardInfoCardProps) {
   return (
      <div className={`di__card dash-bg ${className}`}>
         <p className="di-card__title">{data.title}</p>

         <div className="di-card__container">
            <div className="di-card__value--container">
               <p className="di-card__value">{data.value}</p>
            </div>

            <div className="di-card__img--container">
               <Image src={data.icon} width={45} height={45} alt={`${data.title} icon`} className="di-card__img" />
            </div>
         </div>
      </div>
   );
}

export default DashboardInfoCard;
