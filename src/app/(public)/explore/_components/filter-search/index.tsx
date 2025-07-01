"use client";

import "./style.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import { ReactNode, useEffect, useRef, useState } from "react";

import Image from "next/image";
import InputSingleCheckbox from "@/components/input-single-checkbox";
import FilterButton from "./filter-button";
import FilterContainer from "./filter-container";
import InputFilter from "./input-filter";
import SortBy from "./sort-by";
import RatingLabel from "./rating-label";
import { SuggestionsScroll } from "../../_components";
import { ServerFetch } from "@/actions/server-fetch";
import { useRouter } from "next/navigation";

import { DateRange, RangeKeyDict } from "react-date-range";

type StrictRange = {
   startDate: Date;
   endDate: Date;
   key: string;
};

interface FilterSearchProps {
   children: ReactNode;
   suggestions: Array<{
      id: string | number;
      name: string;
   }>;
   totalResults: number;
   searchskill: string;
   filterdata: Array<{
      id: string | number;
      name: string;
   }>;
   filtertype: string;
   location: string;
   t: string;
}
interface FilterList {
   locations: Array<{ id: string; label: string; value: string }>;
   teachingModes: Array<{ id: string; label: string; value: string }>;
   batchTypes: Array<{ id: string; label: string; value: string }>;
}

interface ApiResponse {
   data: FilterList;
}

function FilterSearch({
   children,
   suggestions,
   totalResults,
   searchskill,
   filterdata,
   location,
   t,
   filtertype,
}: FilterSearchProps) {
   const initialRender = useRef(true);
   const router = useRouter();

   const breakPoint = useRef(1080);
   const [showFilters, setShowFilters] = useState(false);
   const [searchKeyVal, setSearchKeyVal] = useState(searchskill || "");
   const [filterList, setFilterList] = useState<FilterList | null>(null);

   const [selectedStar, setSelectedStar] = useState<string | null>(null);
   const [selectedLocation, setSelectedLocation] = useState(location || null);
   const [selectedTeachingMode, setSelectedTeachingMode] = useState<string | null>(null);
   const [modeType, setModeType] = useState(t || "");
   const [selectedBatchType, setSelectedBatchType] = useState<string | null>(null);
   const [sortValue, setSortValue] = useState("");

   const [startdate, setStartdate] = useState("");
   const [enddate, setEnddate] = useState("");

   const [state, setState] = useState<StrictRange[]>([
      {
         startDate: new Date(),
         endDate: new Date(),
         key: "selection",
      },
   ]);

   useEffect(() => {
      setSearchKeyVal(searchskill || "");
      //setSelectedLocation(location || null);
      if (t?.toString() === "1") {
         setSelectedTeachingMode("Offline");
      }
      if (t?.toString() === "2") {
         setSelectedTeachingMode("Online");
      }
      setModeType(t || "");
   }, [searchskill, location, t]);

   const toggleFilters = () => {
      if (window.innerWidth >= breakPoint.current) {
         return;
      }
      setShowFilters((prev) => !prev);
   };

   useEffect(() => {
      const handleScreenResize = () => {
         //1080px is the media query min width in header css file
         if (window.innerWidth >= breakPoint.current) {
            setShowFilters(false);
         }
      };

      window.addEventListener("resize", handleScreenResize);
      return () => {
         window.removeEventListener("resize", handleScreenResize);
      };
   }, []);

   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
         return () => {};
      }

      if (showFilters) {
         document.body.classList.add("overflow-hidden");
      } else {
         document.body.classList.remove("overflow-hidden");
      }

      return () => {
         document.body.classList.remove("overflow-hidden");
      };
   }, [showFilters]);

   const getFilterData = async () => {
      let url: string;
      if (selectedLocation) {
         url = `/FilterParameterList/${filtertype}?city_name=${selectedLocation}`;
      } else {
         url = `/FilterParameterList/${filtertype}`;
      }

      const result: ApiResponse = await ServerFetch(url, {
         headers: { "Content-Type": "application/json" },
         next: { revalidate: 5 },
      });
      setFilterList(result?.data);
   };

   useEffect(() => {
      getFilterData();
   }, []);

   const handleKeyPress = (e: any) => {
      if (e.key === "Enter") {
         updateURL();
      }
   };

   const updateURL = () => {
      const params = new URLSearchParams();
      if (searchKeyVal) params.set("search_key", searchKeyVal.toLowerCase());
      if (selectedLocation !== "online") {
         if (selectedLocation) params.set("location", selectedLocation?.toLowerCase());
      }

      if (selectedTeachingMode) params.set("mode", selectedTeachingMode);
      if (modeType) params.set("t", modeType);
      if (selectedBatchType) params.set("batch", selectedBatchType);
      if (selectedStar) params.set("rating", selectedStar);
      if (sortValue) params.set("sortby", sortValue);
      if (startdate) params.set("startdate", startdate);
      if (enddate) params.set("enddate", enddate);
      setShowFilters(false);

      router.push(`?${params.toString()}`);
   };

   useEffect(() => {
      updateURL();
   }, [selectedLocation, selectedTeachingMode, selectedBatchType, searchKeyVal, selectedStar, modeType, sortValue]);

   const getActiveFilterCount = () => {
      const filters = [selectedLocation, selectedTeachingMode, selectedBatchType, selectedStar];
      return filters.filter((filter) => filter !== null).length;
   };

   const handleSortChange = (value: string) => {
      setSortValue(value);
   };

   const handleDateChange = (rangesByKey: RangeKeyDict) => {
      const selection = rangesByKey.selection; // Access the selection key directly

      if (!selection) {
         console.error("Selection range not found.");
         return;
      }

      const startDate = selection.startDate ?? new Date(); // Fallback to current date
      const endDate = selection.endDate ?? new Date(); // Fallback to current date

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      console.log(formattedStartDate, formattedEndDate);

      const params = new URLSearchParams();
      if (searchKeyVal) params.set("search_key", searchKeyVal.toLowerCase());
      if (selectedLocation) params.set("location", selectedLocation.toLowerCase());
      if (selectedTeachingMode) params.set("mode", selectedTeachingMode);
      if (modeType) params.set("t", modeType);
      if (selectedBatchType) params.set("batch", selectedBatchType);
      if (selectedStar) params.set("rating", selectedStar);
      if (sortValue) params.set("sortby", sortValue);
      if (formattedStartDate) params.set("startdate", formattedStartDate);
      if (formattedEndDate) params.set("enddate", formattedEndDate);
      setShowFilters(false);
      router.push(`?${params.toString()}`);

      setStartdate(formattedStartDate);
      setEnddate(formattedEndDate);

      setState([
         {
            startDate,
            endDate,
            key: "selection",
         },
      ]);
   };

   const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
   };

   return (
      <div className="container filter-results">
         <FilterButton count={getActiveFilterCount()} className="filter-results__sec-1" onClick={toggleFilters} />
         <InputFilter
            onKeyDown={handleKeyPress}
            onChange={(e) => setSearchKeyVal(e.target.value)}
            value={searchKeyVal}
            placeholder="Search..."
            id="input-filter"
            containerClassName="filter-results__sec-2"
         />
         <SortBy className="filter-results__sec-3" onSortChange={handleSortChange} filtertype={filtertype} />
         <section className="filter-results__sec-others">
            {/* <SuggestionsScroll suggestions={suggestions} location={selectedLocation ?? null}  modetype={modeType} /> */}
            {searchKeyVal && (
               <p className="filter-results__total-results">
                  <strong>{totalResults}</strong> results find for “{searchKeyVal}”
               </p>
            )}
         </section>
         <section className={`filter-results__sec-4 ${showFilters ? "show" : ""}`}>
            <div onClick={toggleFilters} className="filter-results__close">
               <Image src="/img/icons/close.svg" alt="Close" width={40} height={40} />
            </div>
            {filtertype !== "webinar" && (
               <FilterContainer title="Ratings">
                  <InputSingleCheckbox
                     name="filter-ratings"
                     value={selectedStar}
                     onChange={setSelectedStar}
                     items={[
                        {
                           id: "filter-ratings5",
                           label: <RatingLabel rating={5} />,
                           value: "5",
                        },
                        {
                           id: "filter-ratings4",
                           label: <RatingLabel rating={4} />,
                           value: "4",
                        },
                        {
                           id: "filter-ratings3",
                           label: <RatingLabel rating={3} />,
                           value: "3",
                        },
                        {
                           id: "filter-ratings2",
                           label: <RatingLabel rating={2} />,
                           value: "2",
                        },
                        {
                           id: "filter-ratings1",
                           label: <RatingLabel rating={1} />,
                           value: "1",
                        },
                     ]}
                  />
               </FilterContainer>
            )}
            {location !== "online" && (
               <FilterContainer title="Area">
                  {filterList?.locations && (
                     <InputSingleCheckbox
                        name="filter-locations"
                        items={filterList?.locations}
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                     />
                  )}
               </FilterContainer>
            )}
            {(filtertype == "course" || filtertype == "webinar") && (
               <FilterContainer title="Teaching Mode">
                  {filterList?.teachingModes && (
                     <InputSingleCheckbox
                        name="filter-teaching-mode"
                        items={filterList?.teachingModes}
                        value={selectedTeachingMode}
                        onChange={setSelectedTeachingMode}
                     />
                  )}
               </FilterContainer>
            )}
            {filtertype == "course" && (
               <FilterContainer title="Batch Type">
                  {filterList?.batchTypes && (
                     <InputSingleCheckbox
                        name="filter-batch-type"
                        items={filterList?.batchTypes}
                        value={selectedBatchType}
                        onChange={setSelectedBatchType}
                     />
                  )}
               </FilterContainer>
            )}
            {filtertype == "webinar" && (
               <FilterContainer title="Date Range">
                  <DateRange
                     editableDateInputs={true}
                     onChange={handleDateChange}
                     moveRangeOnFirstSelection={false}
                     ranges={state}
                  />
               </FilterContainer>
            )}
         </section>
         <section className="filter-results__sec-5">{children}</section>
      </div>
   );
}

export default FilterSearch;
