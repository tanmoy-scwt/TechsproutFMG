"use client";

import { X } from "lucide-react";
import { ChangeEvent, ComponentProps, KeyboardEvent, ReactNode, useState } from "react";

interface InputWithTagsProps extends Omit<ComponentProps<"input">, "onChange" | "value"> {
   id: string;
   label?: string;
   onChange?: (value: string) => void;
}
export type TagsData = Array<{ id: number; value: ReactNode }>;

function InputWithTags({ id, label, onChange, ...props }: InputWithTagsProps) {
   const [value, setValue] = useState("");
   const [tags, setTags] = useState<TagsData>([]);

   const addNewTag = (value: ReactNode) => {
      setTags((prev) => [...prev, { id: prev.length + 1, value }]);
   };

   const removeTag = (id: number) => {
      const filteredTags = tags.filter((tag) => tag.id !== id);
      setTags(filteredTags);
   };

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      onChange?.(v);
      setValue(v);
   };

   const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         e.preventDefault();
         addNewTag(value);
         setValue("");
      }
   };

   const handleCloseKeyDown = (id: number) => (e: KeyboardEvent<SVGSVGElement>) => {
      if (e.key === "Enter") {
         e.preventDefault();
         removeTag(id);
      }
   };

   return (
      <>
         {label && (
            <label htmlFor={id} className="label">
               {label}
            </label>
         )}
         <input
            type="text"
            className="input"
            id={id}
            onKeyDown={handleInputKeyDown}
            value={value}
            onChange={handleChange}
            {...props}
         />
         <ul className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
               <li
                  key={tag.id}
                  className="bg-slate-50 rounded border border-neutral-400 px-2 py-1 flex gap-2 items-center justify-between cursor-pointer label"
               >
                  {tag.value}
                  <X
                     onClick={() => {
                        removeTag(tag.id);
                     }}
                     size={16}
                     tabIndex={0}
                     onKeyDown={handleCloseKeyDown(tag.id)}
                  />
               </li>
            ))}
         </ul>
      </>
   );
}

export default InputWithTags;
