"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./style.css";
import { SlidersHorizontal } from "lucide-react";

function CoursesFilter() {
  const queryParams = useSearchParams();
  const searchParams = new URLSearchParams(queryParams);
  const router = useRouter();

  return (
    <div className="courses-filter">
      <div className="courses-filter__container">
        <label htmlFor="courses-filter">
          <SlidersHorizontal size={18} />
        </label>
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
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );
}

export default CoursesFilter;
