"use client";
import { useEffect, useMemo, useState } from "react";
import { Country } from "@/app/dashboard/profile/_types";
import { ServerFetch } from "@/actions/server-fetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CountryDropDownData = {
   country: string | null | undefined;
   state: string | null | undefined;
   city: string | null | undefined;
};
interface CountryDropDownProps {
   countryData: Array<Country>;
   defaultValues?: CountryDropDownData;
   onChange?: (values: CountryDropDownData) => void;
   errors?: CountryDropDownData;
}
function CountryDropDown({
   countryData,
   defaultValues = {
      country: "",
      state: "",
      city: "",
   },
   onChange,
   errors,
}: CountryDropDownProps) {
   const [states, setStates] = useState<Array<{ label: string; value: string | number }>>([]);
   const [cities, setCities] = useState<Array<{ label: string; value: string | number }>>([]);
   const [values, setValues] = useState(defaultValues);
   const [loading, setLoading] = useState({
      state: false,
      city: false,
   });
   const countryName = useMemo(() => {
      return countryData.find((state) => values.country && +state.value === +values.country)?.label;
   }, [values.country]);

   const handleOnSelect = (key: keyof CountryDropDownData) => (value: string) => {
      if (key === "country") {
         fetchStates(value);
         onChange?.({ country: value, state: "", city: "" });
         setValues({ country: value, state: "", city: "" });
      } else if (key === "state") {
         onChange?.({ ...values, state: value, city: "" });
         setValues((prev) => ({ ...prev, state: value, city: "" }));
         fetchCities(value);
      } else if (key === "city") {
         onChange?.({ ...values, city: value });
         setValues((prev) => ({ ...prev, city: value }));
      }
   };

   const fetchStates = async (value: string) => {
      try {
         setLoading((prev) => ({ ...prev, state: true }));

         const result = await ServerFetch(`/state/listing?country_id=${value}`, {
            headers: {
               "Content-Type": "application/json",
            },
            next: {
               revalidate: 300,
               tags: ["State"],
            },
         });
         if (Array.isArray(result?.data)) {
            setStates(result.data);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading((prev) => ({ ...prev, state: false }));
      }
   };

   const fetchCities = async (value: string) => {
      try {
         setLoading((prev) => ({ ...prev, city: true }));

         const result = await ServerFetch(`/city/listing?state_id=${value}`, {
            headers: {
               "Content-Type": "application/json",
            },
            next: {
               revalidate: 300,
               tags: ["City"],
            },
         });

         if (Array.isArray(result?.data)) {
            setCities(result.data);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading((prev) => ({ ...prev, city: false }));
      }
   };

   useEffect(() => {
      if (defaultValues.country) {
         if (defaultValues.state) {
            fetchStates(defaultValues.country);
         }
         if (defaultValues.city && defaultValues.state) {
            fetchCities(defaultValues.state);
         }
      }
   }, []);

   return (
      <>
         <div>
            <label htmlFor="country" className="label">
               Select Country
            </label>
            <Select value={values.country || ""} name="country" onValueChange={handleOnSelect("country")}>
               <SelectTrigger className="w-full">
                  <SelectValue>{countryName || "Please select"}</SelectValue>
               </SelectTrigger>
               <SelectContent>
                  {countryData?.map((country) => (
                     <SelectItem key={country.value} value={country.value}>
                        {country.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>
         {values.country && (
            <div>
               <label htmlFor="state" className="label">
                  Select State
               </label>
               <Select value={values.state || ""} name="state" onValueChange={handleOnSelect("state")}>
                  <SelectTrigger className="w-full">
                     <SelectValue>
                        {states?.length === 0
                           ? "No States Available"
                           : states.find((c) => values.state && +c.value === +values.state)?.label || "Please select"}
                     </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                     {states?.map((state) => (
                        <SelectItem key={state.value} value={`${state.value || ""}`}>
                           {state.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         )}

         {values.state && (
            <div>
               <label htmlFor="city" className="label">
                  Select City
               </label>
               <Select value={values.city || ""} name="city" onValueChange={handleOnSelect("city")}>
                  <SelectTrigger className="w-full">
                     <SelectValue>
                        {cities?.length === 0
                           ? "No Cities Available"
                           : cities.find((c) => values.city && +c.value === +values.city)?.label || "Please select"}
                     </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                     {cities?.map((city) => (
                        <SelectItem key={city.value} value={`${city.value || ""}`}>
                           {city.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         )}
      </>
   );

   //    return (
   //       <>
   //          <div>
   //             <Combobox
   //                label="Select Country"
   //                data={countryData}
   //                onSelect={handleOnSelect("country")}
   //                value={values.country}
   //                notFoundMessage="No Countries Listed"
   //             />
   //             {errors?.country && <p className="error">{errors.country}</p>}
   //          </div>
   //          {values.country && (
   //             <div>
   //                <Combobox
   //                   label="Select State"
   //                   data={states}
   //                   dataLoading={loading.state}
   //                   onSelect={handleOnSelect("state")}
   //                   value={values.state}
   //                   notFoundMessage="No State listed for the selected Country."
   //                />
   //                {errors?.state && <p className="error">{errors.state}</p>}
   //             </div>
   //          )}
   //          {values.state && (
   //             <div>
   //                <Combobox
   //                   label="Select City"
   //                   data={cities}
   //                   dataLoading={loading.city}
   //                   onSelect={handleOnSelect("city")}
   //                   value={values.city}
   //                   notFoundMessage="No City listed for the selected State."
   //                />
   //                {errors?.city && <p className="error">{errors.city}</p>}
   //             </div>
   //          )}
   //       </>
   //    );
}

export default CountryDropDown;
