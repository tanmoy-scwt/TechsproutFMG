"use client";

import Image from "next/image";
import "./style.css";
import { useRef } from "react";

interface InputFilterProps extends React.InputHTMLAttributes<HTMLInputElement> {
   containerClassName?: string;
}
function InputFilter({ placeholder = "Search", className = "", containerClassName = "", ...props }: InputFilterProps) {
   const inputRef = useRef<HTMLInputElement>(null);

   return (
      <div className={`in-filter ${containerClassName}`}>
         <Image
            src="/img/icons/search-glass.svg"
            height={24}
            width={24}
            alt={placeholder}
            onClick={() => {
               inputRef.current?.focus();
            }}
         />
         <input type="text" placeholder={placeholder} ref={inputRef} className={`input ${className}`} {...props} />
      </div>
   );
}

export default InputFilter;
