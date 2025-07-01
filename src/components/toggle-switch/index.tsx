"use client";

import "./style.css";
import React from "react";

interface ToggleSiwtchProps {
   id: string;
   className?: string;
   onChange?: (state: boolean) => void;
   defaultState?: boolean;
}

function ToggleSwitch({ id, className = "", onChange, defaultState = false }: ToggleSiwtchProps) {
   const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
   };

   return (
      <div className={`toggle-switch ${className}`}>
         <input
            type="checkbox"
            className="toggle-switch__input"
            id={id}
            defaultChecked={defaultState}
            onChange={handleToggleChange}
         />
         <label className="toggle-switch__label" htmlFor={id}>
            <span className="toggle-switch__button"></span>
         </label>
      </div>
   );
}

export default ToggleSwitch;
