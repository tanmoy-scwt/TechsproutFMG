"use client";
import "./style.css";
import { isValidDate } from "@/lib/utils";
import { DateFilter } from "@/app/dashboard/_components";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function StudentLeadsFilterSection() {
   const queryParams = useSearchParams();
   const searchParams = new URLSearchParams(queryParams);
   const router = useRouter();
   const [dates, setDates] = useState({
      start: searchParams.get("start_date"),
      end: searchParams.get("end_date"),
   });

   const isValidStartDate = isValidDate(dates.start);
   const isValidEndDate = isValidDate(dates.end);

   return (
      <section className="filter-section">
         <div>
            <DateFilter
               fromDate={isValidStartDate && dates.start ? new Date(dates.start) : undefined}
               setFromDate={(d) => {
                  if (isValidDate(new Date(d as Date))) {
                     if (searchParams.has("start_date") || searchParams.has("emd_date")) {
                        searchParams.delete("start_date");
                        searchParams.delete("end_date");

                        router.push(`?${searchParams.toString()}`);
                     }
                     const formattedDate: string = moment(d as Date).format("YYYY-MM-DD");

                     setDates({
                        start: formattedDate,
                        end: null,
                     });
                  }
               }}
               toDate={isValidEndDate && dates.end && dates.start ? new Date(dates.end) : undefined}
               setToDate={(d) => {
                  if (isValidDate(new Date(d as Date))) {
                     const formattedDate: string = moment(d as Date).format("YYYY-MM-DD");
                     searchParams.set("start_date", dates.start as string);
                     searchParams.set("end_date", formattedDate as string);

                     router.push(`?${searchParams.toString()}`);
                     setDates((prev) => ({ ...prev, end: formattedDate }));
                  }
               }}
               fromLabel="From"
               toLabel="To"
            />
            {dates.start && !dates.end && <p className="error">Select end date to filter the results.</p>}
         </div>
         {/* <div className="filter-section__dropdown">
            <select
          className="select"
          id="courses-filter"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value === "all") {
              searchParams.delete("filter");
            } else {
              searchParams.set("filter", e.target.value);
            }
            router.push(`?${searchParams.toString()}`);
          }}
        >
          <option value="" disabled>
            Filter
          </option>
          <option value="all">All</option>
          {[
            { label: "Type 1", value: "1" },
            { label: "Type 2", value: "2" },
          ].map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
            <Upload size={25} className="self-center" />
         </div> */}
      </section>
   );
}

export default StudentLeadsFilterSection;
