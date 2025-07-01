"use client";

import { X } from "lucide-react";
import React, { ComponentProps, ForwardedRef, useCallback, useState, KeyboardEvent } from "react";
import useOutsideClick from "@/hooks/use-outside-click";

export interface AutoFillInputSuggestion {
   value: string | number;
   label: string;
}

interface AutoFillInputProps extends ComponentProps<"input"> {
   id: string;
   onInputValueChange?: (value: string) => void;
   selectedSuggestions: Array<AutoFillInputSuggestion>;
   suggestions: Array<AutoFillInputSuggestion>;
   onSuggestionSelect: (suggestion: AutoFillInputSuggestion) => void;
   onSuggestionRemove: (suggestion: AutoFillInputSuggestion) => void;
   loadingSuggestions?: boolean;
   qualificationToggle?: boolean;
   label: string;
}

function AutoFillInput(
   {
      id,
      onSuggestionRemove,
      onSuggestionSelect,
      selectedSuggestions,
      suggestions,
      onInputValueChange,
      loadingSuggestions,
      label,
      qualificationToggle,
   }: AutoFillInputProps,
   ref: ForwardedRef<HTMLInputElement>
) {
   const [inputValue, setInputValue] = useState("");
   const [isOpen, setIsOpen] = useState(false);
   const closeSuggestions = useCallback(() => {
      setIsOpen(false);
   }, []);
   const innerRef = useOutsideClick<HTMLDivElement>(closeSuggestions);

   const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
         e.preventDefault();
         // If qualificationToggle is true, add custom input as a suggestion
         if (qualificationToggle) {
            const customSuggestion = { value: inputValue, label: inputValue };

            onSuggestionSelect(customSuggestion);
            setInputValue(""); // Clear input after adding custom suggestion
         }
      }
   };
   //    console.log("onSuggestionSelect", onSuggestionSelect);
   const [nextNumber, setNextNumber] = useState(1);

   const handleAddCustomQualification = () => {
      if (qualificationToggle && inputValue.trim()) {
         const customValue = ` ${nextNumber}`; // Dynamic value with number
         const customLabel = `${inputValue}`;

         // Create a custom suggestion
         const customSuggestion = {
            value: customLabel, // The value includes input and dynamic number
            label: customLabel, // Same as value
         };

         // Call the onSuggestionSelect to add the suggestion
         onSuggestionSelect(customSuggestion);

         // Update the nextNumber to be incremented
         setNextNumber((prevNumber) => prevNumber + 1);

         // Clear input and close the dropdown
         setInputValue("");
         setIsOpen(false); // Close suggestions dropdown
      }
   };
   return (
      <div>
         <div className="relative" ref={innerRef}>
            <label htmlFor={id} className="label">
               {label}
            </label>
            <input
               type="text"
               className="input"
               id={id}
               value={inputValue}
               onKeyDown={handleInputKeyDown}
               onChange={(e) => {
                  const value = e.target.value;
                  setIsOpen(true); // Open suggestions on input change
                  setInputValue(value);
                  onInputValueChange?.(value);
               }}
               onFocus={() => setIsOpen(true)}
               onBlur={() => setTimeout(() => setIsOpen(false), 200)}
               ref={ref}
            />

            {isOpen &&
               (suggestions.length > 0 ? (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                     {loadingSuggestions ? (
                        <li className="px-3 py-2 hover:bg-gray-100 text-sm">Loading...</li>
                     ) : suggestions.length === 0 ? (
                        <li className="px-3 py-2 hover:bg-gray-100 text-sm">
                           No suggestions for <strong>{inputValue}</strong>
                        </li>
                     ) : (
                        suggestions.map((suggestion) => (
                           <li
                              key={suggestion.value}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer !text-sm"
                              onClick={() => {
                                 onSuggestionSelect(suggestion);
                                 setIsOpen(false);
                                 setInputValue("");
                              }}
                           >
                              {suggestion.label}
                           </li>
                        ))
                     )}
                  </ul>
               ) : (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                     {/* Show custom option if qualificationToggle is true and inputValue is not empty */}
                     {qualificationToggle && inputValue.trim() && !suggestions.some((s) => s.value === inputValue) && (
                        <li
                           className="px-3 py-2 hover:bg-gray-100 cursor-pointer !text-sm"
                           onClick={
                              handleAddCustomQualification // Close suggestions dropdown
                           }
                        >
                           Add {inputValue}
                        </li>
                     )}
                  </ul>
               ))}
         </div>

         {/* Display selected suggestions */}
         {selectedSuggestions.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-1">
               {selectedSuggestions.map((suggestion) => (
                  <li
                     key={suggestion.value}
                     className="bg-slate-50 rounded border border-neutral-400 px-2 py-1 flex gap-2 items-center justify-between cursor-pointer label w-max"
                  >
                     {suggestion.label}
                     <X onClick={() => onSuggestionRemove(suggestion)} size={16} tabIndex={0} />
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}

export default React.forwardRef(AutoFillInput);
