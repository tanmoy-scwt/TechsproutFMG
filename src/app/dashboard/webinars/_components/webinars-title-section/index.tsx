import Link from "next/link";
import { WebinarFilter } from "../../_components";
import { PlusCircleIcon } from "lucide-react";
import { dashboardLinks as dl } from "@/lib/constants";

function WebinarsTitleSection() {
   return (
      <section className="flex flex-col gap-[15px]">
         <div className="w-full flex flex-row items-center justify-between gap-4">
            <h1 className="subtitle">My Webinars</h1>
            <Link
               href={dl.addWebinars}
               className="bg-primary text-white px-3 py-2 rounded-sm text-xs mob:text-sm flex items-center gap-1"
            >
               Add Webinar
               <PlusCircleIcon stroke="#fff" size={22} className="ml-1" />
            </Link>
         </div>
         <WebinarFilter />
      </section>
   );
}

export default WebinarsTitleSection;
