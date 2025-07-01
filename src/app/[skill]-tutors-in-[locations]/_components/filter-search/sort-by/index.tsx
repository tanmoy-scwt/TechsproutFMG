"use client";
import { useId } from "react";

interface SortByProps {
    className?: string;
    onSortChange: (value: string) => void;
    filtertype?: string;
}

function SortBy({ className = "", filtertype, onSortChange }: SortByProps) {

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        onSortChange(selectedValue);
    };

   const id = useId();
   return (
      <div className={`${className}`}>
         <label htmlFor={id} className="label">
            Sort By:{" "}
         </label>
         <select className="select" id={id} onChange={handleSelectChange}>
            <option value="featured">Featured</option>
            {/* <option value="popular">Most Popular</option> */}
            <option value="rating-high">Rating: High-Low</option>
            <option value="rating-low">Rating: Low-High</option>
            {/* {filtertype === "course" &&
            ["price-high", "price-low"].map((value) => (
                <option value={value} key={value}>
                    {value === "price-high" ? "Price: Low-High" : "Price: High-Low"}
                </option>
            ))} */}
         </select>
      </div>
   );
}

export default SortBy;
