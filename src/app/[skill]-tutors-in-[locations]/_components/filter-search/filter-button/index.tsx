"use client";
import "./style.css";
import FilterIcon from "@/icons/FilterIcon";

function FilterButton({ count = 0, className = "", onClick = () => {} }) {
   return (
      <button className={`filter-btn ${className}`} onClick={onClick}>
         <FilterIcon />
         <span className="text">Filter</span>
         <span className="count">{count}</span>
      </button>
   );
}

export default FilterButton;
