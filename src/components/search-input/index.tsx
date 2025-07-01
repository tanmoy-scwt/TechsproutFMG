/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import "./style.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useOutsideClick from "@/hooks/use-outside-click";
import { ServerFetch } from "@/actions/server-fetch";
import { useRouter } from "next/navigation";
import { ErrorToast } from "@/lib/toast";

import Fuse from "fuse.js";

interface Skill {
  label: string;
}

interface Location {
  label: string;
  value: number;
}

function SearchInput() {
  const router = useRouter();
  const [isSubjectVisible, setIsSubjectVisible] = useState(false);
  const [isLocationVisible, setIsLocationVisible] = useState(false);
  const [skillListing, setSkillListing] = useState<Skill[]>([]);
  const [skillInputValue, setSkillInputValue] = useState("");
  const [skillId, setSkillId] = useState("");
  //const [location, setLocation] = useState(null);
  const [place, setPlace] = useState("");
  //    const inputRef = useRef(null);
  const [locationListing, setLocationListing] = useState<Location[]>([]);
  const [mode, setMode] = useState("1");
  const [isCityVisible, setIsCityVisible] = useState(false);
  const [isTypeListVisible, setIsTypeListVisible] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [skills, setSkills] = useState<{ value: number; label: string }[]>([]);
  const [city, setCity] = useState<{ value: number; label: string }[]>([]);
  const [fuseSkill, setFuseSkill] = useState<Fuse<{
    value: number;
    label: string;
  }> | null>(null);
  const [fuseCity, setFuseCity] = useState<Fuse<{
    value: number;
    label: string;
  }> | null>(null);
  const [results, setResults] = useState<{ value: number; label: string }[]>(
    []
  );
  const [resultsCity, setResultsCity] = useState<{ value: number; label: string }[]>(
    []
  );

  const ref = useOutsideClick<HTMLDivElement>(() => {
    setIsSubjectVisible(false);
    setIsLocationVisible(false);
  });

  const handleChange = async (skillValue: string) => {
    setSkillInputValue(skillValue);
    // if (skillValue != "") {
    //     const skillList  = await ServerFetch(
    //         `/skill/listing?key=${skillValue}`,
    //         { cache: "no-store" }
    //     );
    //     if(skillList){
    //         const skillListing: Skill[] = skillList.data;
    //         setSkillListing(skillList.data);
    //         setIsSubjectVisible(true);
    //         setIsLocationVisible(false);
    //     }
    // }
  };

  /**************************************** */

  // Fetch skills from API
  // Fetch skills from API
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/skill/listing`
        ); // Replace with your actual API endpoint
        const { data } = await res.json(); // Extract 'data' array from response

        setSkills(data); // Store fetched skills

        // Initialize Fuse.js with fetched data
        setFuseSkill(
          new Fuse(data, {
            keys: ["label"], // Search based on 'label' field
            threshold: 0.3,
          })
        );
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }

    fetchSkills();
  }, []);

  // Search when query changes
  useEffect(() => {
    if (skillInputValue.length > 1 && fuseSkill) {
      //   setResults(fuse.search(skillInputValue).map((r) => r.item));
      //   setIsSubjectVisible(true);
      // setIsLocationVisible(false);
      const searchResults = fuseSkill.search(skillInputValue).map((r) => r.item);
      setResults(searchResults.slice(0, 5)); // Show only top 5 results
      setIsSubjectVisible(true);
      setIsLocationVisible(false);
    } else {
      setResults([]);
    }
  }, [skillInputValue, fuseSkill]);


  useEffect(() => {
    async function fetchCity() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/city/listing`
        ); // Replace with your actual API endpoint
        const { data } = await res.json(); // Extract 'data' array from response

        setSkills(data); // Store fetched skills

        // Initialize Fuse.js with fetched data
        setFuseCity(
          new Fuse(data, {
            keys: ["label"], // Search based on 'label' field
            threshold: 0.3,
          })
        );
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }

    fetchCity();
  }, []);

  useEffect(() => {
    if (place.length > 1 && fuseCity) {
      //   setResults(fuse.search(skillInputValue).map((r) => r.item));
      //   setIsSubjectVisible(true);
      // setIsLocationVisible(false);
      const searchResults = fuseCity.search(place).map((r) => r.item);
      setResultsCity(searchResults.slice(0, 5)); // Show only top 5 results
      setIsSubjectVisible(false);
      setIsLocationVisible(true);
    } else {
        setResultsCity([]);
    }
  }, [place, fuseCity]);
  /*************************************** */

  // const handleSkill = async (item:any) => {
  //     setIsSubjectVisible(false);
  //     setSkillInputValue(item.label);
  //     setSkillId(item.value);
  // };

  const handleSkill = (item: any) => {
    setSkillInputValue(item.label); // Set input value
    setSkillId(item.value); // Store selected skill ID
    setResults([]); // Clear search results
    setIsSubjectVisible(false); // Hide dropdown

    // Force a quick re-render by using a small delay
    setTimeout(() => setIsSubjectVisible(false), 0);
  };

  const handleLocationChange = async (locationValue: string) => {
    setPlace(locationValue);
    // if (locationValue != "") {
    //   const locationList = await ServerFetch(
    //     `/city/listing?search_key=${locationValue}`,
    //     { cache: "no-store" }
    //   );
    //   console.log(locationList);
    //   if (locationList) {
    //     const locListing: Location[] = locationList.data;
    //     setLocationListing(locationList.data);
    //     setIsSubjectVisible(false);
    //     setIsLocationVisible(true);
    //   }
    // }
  };

  const handleLocation = async (item: any) => {
    setPlace(item.label);
    setIsLocationVisible(false);
    setResultsCity([]);

    // Force a quick re-render by using a small delay
    setTimeout(() => setIsLocationVisible(false), 0);
  };


  const handleSearch = useCallback(() => {
    if (!skillInputValue || !place) {
      if (!place && dropdownValue === "City") {
        ErrorToast("Please enter the location");
        return; // Exit early if required values are missing
      }
      if (!skillInputValue) {
        ErrorToast("Please enter a skill.");
        return; // Exit early if required values are missing
      }
      if (dropdownValue === "") {
        ErrorToast("Please select location");
        return; // Exit early if required values are missing
      }
    }
    // Construct the URL manually
    //    const queryString = new URLSearchParams({
    //       search_key: skillInputValue.toLowerCase(),
    //       location: place.toLowerCase(),
    //       t: mode,
    //       //skillId: skillId,
    //    }).toString();

    //router.push(`/explore/courses?${queryString}`);
    if (dropdownValue === "Online") {
      router.push(
        `/${skillInputValue
          .replace(/\s+/g, "-")
          .toLowerCase()}-tutors-in-${dropdownValue
          .replace(/\s+/g, "-")
          .toLowerCase()}`
      );
    } else {
      router.push(
        `/${skillInputValue
          .replace(/\s+/g, "-")
          .toLowerCase()}-tutors-in-${place.replace(/\s+/g, "-").toLowerCase()}`
      );
    }
  }, [router, skillId, skillInputValue, place, mode, dropdownValue]);

  const handleType = () => {
    setIsTypeListVisible(isTypeListVisible ? false : true);
  };

  const changeType = (val: string) => {
    //console.log('val', val);
    if (val) {
      setIsTypeListVisible(false);
      setDropdownValue(val);
      val === "City" ? setIsCityVisible(true) : setIsCityVisible(false);
      if (val === "Online") {
        setDropdownValue("Online");
        //router.push(`/${skillInputValue.replace(/\s+/g, "-").toLowerCase()}-tutors-in-${val.replace(/\s+/g, "-").toLowerCase()}`);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const value = event.currentTarget.getAttribute("data-value"); // Retrieve custom data attribute
    if (value) {
      changeType(value);
    }
  };

  return (
    <div className="search-input" ref={ref}>
      <div className="search-input__type skills">
        <label htmlFor="subject">
          <Image
            src="/img/icons/subject-search.svg"
            width={20}
            height={20}
            alt="Subject Search"
          />
        </label>
        {/* <input
               type="text"
               id="subject"
               placeholder="Subject / Skill"
               value={skillInputValue}
               onChange={(e) => handleChange(e.target.value)}
               autoComplete="off"
            />
            {isSubjectVisible && skillListing?.length > 0 ?
               <ul className="list-items">
                  {skillListing?.map((item, index) => (
                     <li onClick={() =>  handleSkill(item)} key={index}>{item?.label}</li>
                    ))}
               </ul>
            :null} */}
        <input
          type="text"
          id="subject"
          placeholder="Subject / Skill"
          value={skillInputValue}
          onChange={(e) => handleChange(e.target.value)}
          autoComplete="off"
        />
        {isSubjectVisible && results?.length > 0 ? (
          <ul className="list-items">
            {results.map((skill, index) => (
              <li key={index} onClick={() => handleSkill(skill)}>
                {skill.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {(dropdownValue === "" || dropdownValue === "Online") && (
        <div className="search-input__type type search-input__type_content">
          {/* <label htmlFor="subject">
               <Image src="/img/icons/subject-search.svg" width={20} height={20} alt="Subject Search" />
            </label> */}
          {/* <select name="mode" onChange={(e) => handleModeChange(e.target.value)}>
                <option value="1">In persion</option>
                <option value="2">Online</option>
            </select> */}
          <p onClick={handleType}>
            {dropdownValue === "" ? (
              <>
                <svg
                  width="20"
                  height="24"
                  viewBox="0 0 18 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.24953 20.8338L8.6196 21.3839L7.98967 20.8338C2.69248 16.2084 0 12.1697 0 8.6196C0 3.59213 3.92388 0 8.6196 0C13.3153 0 17.2392 3.59213 17.2392 8.6196C17.2392 12.1697 14.5467 16.2084 9.24953 20.8338ZM1.91547 8.6196C1.91547 11.3484 4.12458 14.7812 8.6196 18.8323C13.1146 14.7812 15.3237 11.3484 15.3237 8.6196C15.3237 4.68964 12.2934 1.91547 8.6196 1.91547C4.94584 1.91547 1.91547 4.68964 1.91547 8.6196ZM8.6196 3.83093C11.2643 3.83093 13.4083 5.97489 13.4083 8.6196C13.4083 11.2643 11.2643 13.4083 8.6196 13.4083C5.97489 13.4083 3.83093 11.2643 3.83093 8.6196C3.83093 5.97489 5.97489 3.83093 8.6196 3.83093ZM8.6196 5.7464C7.03277 5.7464 5.7464 7.03277 5.7464 8.6196C5.7464 10.2064 7.03277 11.4928 8.6196 11.4928C10.2064 11.4928 11.4928 10.2064 11.4928 8.6196C11.4928 7.03277 10.2064 5.7464 8.6196 5.7464Z"
                    fill="#BCBCBC"
                  />
                </svg>
                Location
              </>
            ) : (
              dropdownValue
            )}
          </p>
          {isTypeListVisible ? (
            <ul>
              <li data-value="City" onClick={handleClick}>
                <Image
                  src="/img/icons/search.svg"
                  width={20}
                  height={20}
                  alt="City"
                />
                Enter City
              </li>
              <li data-value="Online" onClick={handleClick}>
                <Image
                  src="/img/icons/video-camera.svg"
                  width={20}
                  height={20}
                  alt="Online"
                />
                Online
              </li>
            </ul>
          ) : null}
        </div>
      )}
      {isCityVisible ? (
        <div
          className="search-input__type location search-input__type_content"
          // onFocus={() => {
          //    setIsSubjectVisible(false);
          //    setIsLocationVisible(true);
          // }}
        >
          <label htmlFor="skills" onClick={handleType}>
            <Image
              src="/img/icons/location-gray.svg"
              width={20}
              height={20}
              alt="Select Location"
            />
          </label>
          {/* <input type="text" onChange={(e) => setPlace(e.target.value)} value={place} id="skills" placeholder="Location" ref={inputRef} /> */}
          {isTypeListVisible ? (
            <ul>
              <li data-value="City" onClick={handleClick}>
                <Image
                  src="/img/icons/search.svg"
                  width={20}
                  height={20}
                  alt="City"
                />
                Enter City
              </li>
              <li data-value="Online" onClick={handleClick}>
                <Image
                  src="/img/icons/video-camera.svg"
                  width={20}
                  height={20}
                  alt="Online"
                />
                Online
              </li>
            </ul>
          ) : (
            <input
              type="text"
              onChange={(e) => handleLocationChange(e.target.value)}
              value={place}
              id="location"
              placeholder="City"
              autoComplete="off"
              autoFocus
            />
          )}


          {isLocationVisible && resultsCity?.length > 0 ? (
          <ul className="list-items">
            {resultsCity.map((city, index) => (
              <li key={index} onClick={() => handleLocation(city)}>
                {city.label}
              </li>
            ))}
          </ul>
        ) : null}
        </div>
      ) : null}
      <button className="search-input__button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchInput;
