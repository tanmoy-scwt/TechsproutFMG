import "./style.css";
import { InputHTMLAttributes } from "react";

export interface InputCheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
   id?: string;
   label?: string | React.ReactNode;
   value: string;
   labelClassName?: string;
}

function InputCheckBox({
   id,
   label,
   labelClassName,
   className = "",
   checked,
   ...props
}: Omit<InputCheckBoxProps, "type">) {
   return (
      <div className="icb">
         <input type="checkbox" className={`checkbox ${className}`} id={id} checked={checked} {...props} />
         {label && (
            <label htmlFor={id} className={`label ${checked ? "selected" : ""} ${labelClassName}`}>
               {label}
            </label>
         )}
      </div>
   );
}

export default InputCheckBox;
