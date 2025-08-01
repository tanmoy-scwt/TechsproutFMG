"use client";

import { ComponentProps, useRef, useState } from "react";

interface InputWithCharacterLimitProps extends ComponentProps<"input"> {
   label?: string;
   id: string;
   maxLength?: number;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   isValid?: boolean;
   starActive?: boolean;
}

export default function InputWithCharacterLimit({
   id,
   maxLength = 50,
   onChange,
   label,
   starActive,
   value: outerValue,
   isValid,
   ...props
}: InputWithCharacterLimitProps) {
   const [value, setValue] = useState("");
   const counterContainerRef = useRef<HTMLDivElement>(null);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e);
   };

   return (
      <>
         {label && (
            <label className="label" htmlFor={id}>
               {label}
               {starActive && <span className="text-red-500 ml-1">*</span>}
            </label>
         )}
         <div className="relative">
            <input
               id={id}
               className="input"
               type="text"
               maxLength={maxLength}
               value={outerValue ?? value}
               aria-describedby="character-count"
               onChange={handleChange}
               style={{ paddingRight: (counterContainerRef.current?.clientWidth || 50) + 10 }}
               {...props}
            />
            <div
               id="character-count"
               className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
               aria-live="polite"
               role="status"
               ref={counterContainerRef}
            >
               {value.length}/{maxLength}
            </div>
         </div>
         {!isValid && (
            <p className="error">
               please enter a valid {label?.toLowerCase() || "name"}
            </p>
         )}
      </>
   );
}
