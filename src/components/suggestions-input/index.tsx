"use client";

import { X } from "lucide-react";
import { ChangeEvent, ComponentProps, KeyboardEvent, useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce/useDebounce";

interface Suggestion {
   value: string;
   label: string;
}

interface SuggestiveInputProps extends Omit<ComponentProps<"input">, "onChange" | "value"> {
   id: string;
   label?: string;
   techSkill?: boolean;
   techlang?: string;
   onChange?: ({ target }: { target: { value: string | string[]; name: string } }) => void;
   value?: string | string[];
   fetchSuggestions: (query: string) => Promise<Suggestion[]>;
   multiple?: boolean;
   name?: string;
   isLoading?: boolean;
   isValid?: boolean;
   objectValue?: Suggestion | Suggestion[];
}

function SuggestiveInput({
   id,
   label,
   onChange,
   value,
   fetchSuggestions,
   multiple = false,
   name,
   isLoading = false,
   isValid = true,
   objectValue,
   techlang,
   techSkill,
   ...props
}: SuggestiveInputProps) {
   const [inputValue, setInputValue] = useState("");
   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
   const [isOpen, setIsOpen] = useState(false);
   const debouncedInputValue = useDebounce(inputValue, 300);
   const inputRef = useRef<HTMLInputElement>(null);

   const [selectedSuggestions, setSelectedSuggestions] = useState<Suggestion[]>([]);

   // This effect runs only when the debounced input value changes
   useEffect(() => {
      if (debouncedInputValue) {
         fetchSuggestions(debouncedInputValue).then(setSuggestions);
      } else {
         setSuggestions([]);
      }
   }, [debouncedInputValue]);

   useEffect(() => {
      if (objectValue) {
         if (Array.isArray(objectValue)) {
            setSelectedSuggestions(objectValue);
         } else {
            setSelectedSuggestions([objectValue]);
         }
      }
   }, [objectValue]);

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputValue(v);
      setIsOpen(true);
   };

   const handleSelect = (selectedSuggestion: Suggestion) => {
      setInputValue("");
      setIsOpen(false);
      inputRef.current?.focus();

      if (multiple) {
         const currentValues = Array.isArray(value) ? value : [];
         if (!currentValues.includes(selectedSuggestion?.value)) {
            const newValue = [...currentValues, selectedSuggestion?.value];

            onChange?.({ target: { value: newValue, name: name as string } });
            setSelectedSuggestions([...selectedSuggestions, selectedSuggestion]);
         }
      } else {
         onChange?.({ target: { value: selectedSuggestion?.value, name: name as string } });
         setSelectedSuggestions([selectedSuggestion]);
      }
   };

   const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         e.preventDefault();
         // Prevent form submission on Enter key
      }
   };

   const removeTag = (tagToRemove: string) => {
      if (multiple) {
         const newValue = (value as string[])?.filter((v) => v != tagToRemove);

         onChange?.({ target: { value: newValue, name: name as string } });
         setSelectedSuggestions(selectedSuggestions.filter((s) => s?.value !== tagToRemove));
      } else {
         onChange?.({ target: { value: "", name: name as string } });
         setSelectedSuggestions([]);
      }
   };

   const renderTags = () => {
      return selectedSuggestions.map((suggestion) => (
         <li
            key={suggestion?.value}
            className="bg-slate-50 rounded border border-neutral-400 px-2 py-1 flex gap-2 items-center justify-between cursor-pointer label"
         >
            {suggestion.label}
            <X onClick={() => removeTag(suggestion?.value)} size={16} tabIndex={0} />
         </li>
      ));
   };

   const handleCustomAddition = () => {
      if (!inputValue) return;

      const customSkill = { value: inputValue, label: inputValue };

      handleSelect(customSkill);
      setInputValue(""); // Clear the input after adding
      setIsOpen(false); // Close the suggestions dropdown
   };
   console.log("label", label);
   return (
      <>
         {label === "Skills" && (
            <label htmlFor={id} className="label">
               Skills / Subject {/* Select {label} */}
            </label>
         )}
         {techlang && (
            <label htmlFor={id} className="label">
               Teaching {techlang}
            </label>
         )}

         <div className="relative">
            <input
               type="text"
               className="input"
               id={id}
               ref={inputRef}
               value={inputValue}
               onChange={(e) => {
                  handleChange(e);
                  setIsOpen(true);
               }}
               onKeyDown={handleInputKeyDown}
               onFocus={() => setIsOpen(true)}
               onBlur={() => setTimeout(() => setIsOpen(false), 200)}
               {...props}
            />
            {!isValid && <p className="error">please enter a valid {label?.toLowerCase() || "name"}</p>}
            {isOpen &&
               debouncedInputValue &&
               (suggestions.length > 0 ? (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                     {/* {suggestions.map((suggestion) => (
                        <li
                           key={suggestion?.value}
                           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                           onMouseDown={() => handleSelect(suggestion)}
                        >
                           {suggestion.label}
                        </li>
                     ))} */}
                     {suggestions.map((suggestion) => (
                        <li
                           key={suggestion?.value}
                           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                           onMouseDown={() => handleSelect(suggestion)}
                        >
                           {suggestion.label}
                        </li>
                     ))}
                     {!isLoading && (
                        <li
                           className="px-3 py-2 text-blue-500 hover:bg-gray-100 cursor-pointer"
                           onMouseDown={handleCustomAddition}
                        >
                           {techlang || techSkill ? "" : <span> Add {inputValue}</span>}
                        </li>
                     )}
                  </ul>
               ) : (
                  //   <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                  //      <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  //         {isLoading ? "Loading..." : "No results found"}
                  //      </li>
                  //   </ul>
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                     {techlang || techSkill ? (
                        ""
                     ) : (
                        <li
                           className="px-3 py-2 text-blue-500 hover:bg-gray-100 cursor-pointer"
                           onMouseDown={handleCustomAddition}
                        >
                           Add {inputValue}
                        </li>
                     )}
                  </ul>
               ))}
         </div>
         <ul className="flex gap-2 flex-wrap mt-2">{renderTags()}</ul>
      </>
   );
}

export default SuggestiveInput;
