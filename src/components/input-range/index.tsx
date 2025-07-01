import "./style.css";
import React, { useCallback, useEffect, useState, useRef, SetStateAction, InputHTMLAttributes } from "react";

interface InputRangeProps extends InputHTMLAttributes<HTMLInputElement> {
   id: string | undefined;
   min: number;
   max: number;
   onMinChange?: (value: number) => void | SetStateAction<number>;
   onMaxChange?: (value: number) => void | SetStateAction<number>;
   showValues?: boolean;
   valueContentBefore?: string;
   valueContentAfter?: string;
}

const InputRange = ({
   id,
   min = 0,
   max = 100,
   onMinChange,
   onMaxChange,
   showValues = true,
   valueContentBefore = "",
   valueContentAfter = "",
}: InputRangeProps) => {
   const [minVal, setMinVal] = useState(min);
   const [maxVal, setMaxVal] = useState(max);
   const [focus, setFocus] = useState<{
      left: boolean;
      right: boolean;
   }>({ left: false, right: false });
   const minValRef = useRef(min);
   const maxValRef = useRef(max);
   const range = useRef<HTMLDivElement>(null);

   // Convert to percentage
   const getPercent = useCallback((value: number) => ((value - min) / (max - min)) * 100, [min, max]);

   //Setting focus value
   const handleFocus = (key: 1 | 2 | 10 | 20) => () => {
      if (key === 1) {
         setFocus((prev) => ({ ...prev, left: true }));
      } else if (key === 2) {
         setFocus((prev) => ({ ...prev, right: true }));
      } else if (key === 10) {
         setFocus((prev) => ({ ...prev, left: false }));
      } else if (key === 20) {
         setFocus((prev) => ({ ...prev, right: false }));
      }
   };

   // Set width of the range to decrease from the left side
   useEffect(() => {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxValRef.current);

      if (range.current) {
         range.current.style.left = `${minPercent}%`;
         range.current.style.width = `${maxPercent - minPercent}%`;
      }
   }, [minVal, getPercent]);

   // Set width of the range to decrease from the right side
   useEffect(() => {
      const minPercent = getPercent(minValRef.current);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
         range.current.style.width = `${maxPercent - minPercent}%`;
      }
   }, [maxVal, getPercent]);

   return (
      <div className="mr__input">
         {showValues && (
            <div className="mr__input--values">
               <label
                  htmlFor={id + "_min"}
                  className="mr-input__slider--left-value "
               >{`${valueContentBefore}${minVal}${valueContentAfter}`}</label>
               <label
                  htmlFor={id + "_max"}
                  className="mr-input__slider--right-value "
               >{`${valueContentBefore}${maxVal}${valueContentAfter}`}</label>
            </div>
         )}
         <div className="mr-input__container">
            <input
               id={id + "_min"}
               type="range"
               min={min}
               max={max}
               value={minVal}
               onChange={(event) => {
                  const value = Math.min(Number(event.target.value), maxVal - 1);
                  setMinVal(value);
                  onMinChange?.(value);
                  minValRef.current = value;
               }}
               className={`mr-input__thumb mr-input__thumb--left ${focus.left ? "focus" : ""}`}
               onFocus={handleFocus(1)}
               onBlur={handleFocus(10)}
               style={{ zIndex: minVal + 5 > max ? "5" : "4" }}
            />
            <input
               id={id + "_max"}
               type="range"
               min={min}
               max={max}
               value={maxVal}
               onChange={(event) => {
                  const value = Math.max(Number(event.target.value), minVal + 1);
                  setMaxVal(value);
                  onMaxChange?.(value);
                  maxValRef.current = value;
               }}
               onFocus={handleFocus(2)}
               onBlur={handleFocus(20)}
               className={`mr-input__thumb mr-input__thumb--right ${focus.right ? "focus" : ""}`}
            />
            <div className="mr-input__slider">
               <div className="mr-input__slider--track" />
               <div ref={range} className="mr-input__slider--range" />
            </div>
         </div>
      </div>
   );
};

export default InputRange;
