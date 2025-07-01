"use client";

import "./style.css";
import React, { useState } from "react";
import InputCheckBox, { InputCheckBoxProps } from "../input-checkbox";

interface InputSingleCheckboxProps {
   name: string;
   items: Array<InputCheckBoxProps>;
   onChange?: (v: string | null) => void;
   value?: string | null;
}

function InputSingleCheckbox({ name, items, onChange, value }: InputSingleCheckboxProps) {
   return (
      <div className="iscb">
         {items.map((item) => (
            <InputCheckBox
               label={item.label}
               key={item.value}
               name={name}
               id={item.id}
               value={item.value}
               labelClassName={item.labelClassName || ""}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (value === e.target.value) {
                     onChange?.(null);
                     return;
                  }
                  onChange?.(e.target.value);
               }}
               checked={value === item.value}
            />
         ))}
      </div>
   );
}

export default InputSingleCheckbox;
