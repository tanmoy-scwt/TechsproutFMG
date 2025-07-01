"use client";
import InputWithCharacterLimit from "@/components/input-with-character-limit";
import InputWithEndSelect from "@/components/input-with-end-select";
import InputSingleCheckbox from "@/components/input-single-checkbox";
import InputCheckBox from "@/components/input-checkbox";
import React, { useCallback, useState } from "react";
import { FormDataType } from "@/types";
import SuggestiveInput from "@/components/suggestions-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServerFetch } from "@/actions/server-fetch";
interface CategoryOption {
   label: string;
   value: string | number;
}
function AddCourseFormStep1({
   formData,
   onInpChange,
   dataLoading,
   handleCheckboxChange,
   categoryData,
   CategorySelect,
}: {
   formData: FormDataType;
   handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   CategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
   checkboxValue: number;
   categoryData: CategoryOption[];
   onInpChange: (e: {
      target: {
         name: string;
         value: string | number | string[] | null;
      };
   }) => void;
   dataLoading?: boolean;
}) {
   const [loadingKey, setLoadingKey] = useState<string | null>(null);

   const listingEndpoints = {
      category_id: "/category",
      language: "/language",
      skill: "/skill",
   };

   const fetchSuggestions = useCallback(
      async (query: string, name: string): Promise<{ value: string; label: string }[]> => {
         if (!query) {
            return [];
         }
         setLoadingKey(name);
         try {
            const { data } = await ServerFetch(
               `${listingEndpoints[name as keyof typeof listingEndpoints]}/listing?key=${query}`
            );

            return data.map((item: any) => ({
               value: String(item.value),
               label: item.label,
            }));
         } catch (error) {
            console.log(error);
            return [];
         } finally {
            setLoadingKey(null);
         }
      },
      []
   );

   return (
      <div className="step1__form">
         <div className="acf__form--items course-name">
            <InputWithCharacterLimit
               label="Course Name"
               id="course_name"
               name="course_name"
               maxLength={50}
               placeholder="Enter course name"
               value={formData.course_name.value as string}
               onChange={onInpChange}
               isValid={formData.course_name.isValid}
            />
         </div>

         <div className="acf__form--items">
            <label>Select Category</label>
            <select
               id="category"
               name="category"
               className="input"
               value={formData.category_id?.value as string[]}
               onChange={CategorySelect}
            >
               <option value="">Select Category</option>
               {categoryData?.map((lang: CategoryOption) => (
                  <option key={lang.value} value={lang.value}>
                     {lang.label}
                  </option>
               ))}
            </select>
         </div>

         <div className="acf__form--items">
            <SuggestiveInput
               id="skill"
               name="skill"
               label="Skills"
               placeholder="Enter skills"
               fetchSuggestions={(query: string) => fetchSuggestions(query, "skill")}
               multiple
               value={formData.skill?.value as string[]}
               onChange={onInpChange}
               isLoading={loadingKey === "skill"}
               isValid={formData.skill.isValid}
               objectValue={
                  formData.skill?.objectValue as {
                     value: string;
                     label: string;
                  }[]
               }
            />
         </div>
         <div className="acf__form--items">
            <SuggestiveInput
               id="language"
               name="language"
               techlang="Language"
               label="Languages"
               placeholder="Enter languages"
               fetchSuggestions={(query: string) => fetchSuggestions(query, "language")}
               multiple
               value={formData.language?.value as string[]}
               onChange={onInpChange}
               isLoading={loadingKey === "language"}
               isValid={formData.language.isValid}
               objectValue={
                  formData.language?.objectValue as {
                     value: string;
                     label: string;
                  }[]
               }
            />
         </div>
         <div className="acf__form--items">
            <label htmlFor="year_of_exp" className="label">
               Experience (In Years)
            </label>
            <input
               type="number"
               id="year_of_exp"
               className="input"
               placeholder="Enter experience"
               value={formData.year_of_exp.value as string}
               onChange={onInpChange}
               name="year_of_exp"
               step="0.1"
                min="0"
               onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (Number(e.target.value) < 0) e.target.value = "";
               }}
            />
            {!formData.year_of_exp.isValid && (
               <p className="error">please enter a valid {formData.year_of_exp.label?.toLowerCase() || "name"}</p>
            )}
         </div>

         <div className="acf__form--items">
            <InputWithEndSelect
               label="Course Duration"
               id="courseDuration"
               selectOptions={
                  formData.duration_unit?.options as {
                     label: string;
                     value: string;
                  }[]
               }
               inputType="number"
               placeholder="Enter duration"
               onChange={onInpChange}
               name="duration_value"
               optionName="duration_unit"
               optionValue={formData.duration_unit.value as string}
               value={formData.duration_value.value as string}
               isValid={formData.duration_value.isValid}
               optionIsValid={formData.duration_unit.isValid}
            />
         </div>
         {!dataLoading && (
            <div className="acf__form--items">
               <label htmlFor="year_of_exp" className="label">
                  Currency
               </label>
               <Select
                  defaultValue={formData.currency_id.value as string}
                  name="currency_id"
                  onValueChange={(val: string) => onInpChange({ target: { name: "currency_id", value: val } })}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="INR" />
                  </SelectTrigger>
                  <SelectContent>
                     {formData?.currency_id?.options?.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                           {item.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         )}

         {formData.fee_upon_enquiry.value == 1 ? (
            <div style={{ width: "20%", padding: "10px 20px" }}></div>
         ) : (
            <div className="acf__form--items">
               <InputWithEndSelect
                  label="Fees"
                  id="fee"
                  selectOptions={formData.fee_unit?.options as { label: string; value: string }[]}
                  inputType="number"
                  placeholder="Enter fee"
                  onChange={onInpChange}
                  name="fee"
                  optionName="fee_unit"
                  optionValue={formData.fee_unit.value as string}
                  isValid={formData.fee.isValid}
                  optionIsValid={formData.fee_unit.isValid}
                  value={formData.fee.value as string}
               />
            </div>
         )}
         <div className="acf__form--items">
            <label>
               <input
                  type="checkbox"
                  id="discuss_upon_enquiry"
                  name="discuss_upon_enquiry"
                  value={formData.fee_upon_enquiry.value as number}
                  checked={(formData.fee_upon_enquiry.value as number) == 1}
                  onChange={handleCheckboxChange}
                  className="checkboxInput"
               />
               <span className="discuss-upon ">Call for fee</span>
            </label>
         </div>

         <div className="acf__form--items">
            <div className="label">Batch Type</div>
            <InputSingleCheckbox
               name="batch_type"
               items={formData.batch_type?.options as { label: string; value: string }[]}
               value={formData.batch_type.value as string}
               onChange={(v: string | null) => {
                  onInpChange({ target: { name: "batch_type", value: v } });
               }}
            />
         </div>
         <div className="acf__form--items">
            <div className="label">Class Type</div>
            <InputSingleCheckbox
               name="teaching_mode"
               items={
                  formData.teaching_mode?.options as {
                     label: string;
                     value: string;
                  }[]
               }
               value={formData.teaching_mode.value as string}
               onChange={(v: string | null) => {
                  onInpChange({ target: { name: "teaching_mode", value: v } });
               }}
            />
         </div>

         <div className="flex items-end course-name mt-3">
            <InputCheckBox
               id="first_class_free"
               value="1"
               label="I can Teach First Lesson For Free"
               checked={formData.first_class_free.value === "1"}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onInpChange({
                     target: {
                        name: "first_class_free",
                        value: e.target.checked ? "1" : "0",
                     },
                  });
               }}
            />
         </div>
      </div>
   );
}

export default AddCourseFormStep1;
