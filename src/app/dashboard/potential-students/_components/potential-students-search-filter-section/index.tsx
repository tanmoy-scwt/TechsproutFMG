'use client';
import { useRouter, useSearchParams } from "next/navigation";
import "./style.css";
import { SearchIcon, SlidersHorizontal } from "lucide-react";

function PotentialStudentsSearchFilterSection() {
    const queryParams = useSearchParams();
   const searchParams = new URLSearchParams(queryParams);
   const router = useRouter();

    const handleSearch = (searchTerm:string) => {
        //console.log("Searching for:", searchTerm);
        searchParams.set("search_key", searchTerm as string);

        router.push(`?${searchParams.toString()}`);
      };

   return (
      <section className="pssf__section">
         <div className="pssf__input--container">
            <label htmlFor="pssf__input">
               <SearchIcon size={18} />
            </label>
            <input type="text" onChange={(e) => handleSearch(e.target.value)}  className="input" name="pssf__input" placeholder="Search Keywords" />
         </div>

         {/* <div className="pssf__filter--container">
            <label htmlFor="pssf__filter">
               <SlidersHorizontal size={18} />
            </label>
            <select className="select" id="pssf__filter" defaultValue="">
               <option value="" disabled>
                  Filter
               </option>
               <option value="all">All</option>
               <option value="approved">Demo 1</option>
               <option value="rejected">Demo 2</option>
               <option value="pending">Demo 3</option>
            </select>
         </div> */}
      </section>
   );
}

export default PotentialStudentsSearchFilterSection;
