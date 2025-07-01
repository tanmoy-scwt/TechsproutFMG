"use client";

import "./style.css";
import Image from "next/image";
import React, { ForwardedRef, useState } from "react";

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type" | "ref"> {
   containerClassName?: string;
}

function PasswordInput(
   { containerClassName = "", className = "", ...props }: PasswordInputProps,
   ref: ForwardedRef<HTMLInputElement>
) {
   const [showPassword, setShowPassword] = useState(false);

   return (
      <div className={`pass-input ${containerClassName}`}>
         <input
            type={showPassword ? "text" : "password"}
            className={`pass-input__input ${className}`}
            ref={ref}
            {...props}
         />
         <div className={`pass-input__img--container ${showPassword ? "show" : ""}`}>
            {showPassword ? (
               <Image
                  src={`/img/icons/password-hide.svg`}
                  height={25}
                  width={25}
                  alt="Show Password"
                  unoptimized
                  className="pass-input__img"
                  onClick={() => {
                     setShowPassword((prev) => !prev);
                  }}
               />
            ) : (
               <Image
                  src={`/img/icons/password-show.svg`}
                  height={22}
                  width={25}
                  alt="Show Password"
                  unoptimized
                  className="pass-input__img"
                  onClick={() => {
                     setShowPassword((prev) => !prev);
                  }}
               />
            )}
         </div>
      </div>
   );
}

export default React.forwardRef(PasswordInput);
