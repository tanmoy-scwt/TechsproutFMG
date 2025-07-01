"use client";

import "./style.css";
import Image from "next/image";
import React, { createContext, useContext, useRef, useState } from "react";

interface ContextType {
   isActive: number | string | null;
   setActive: (index: number | string | null) => void;
}

interface AccordionItemProps extends Omit<React.ComponentProps<"li">, "value"> {
   value: string | number;
   triggerItem: React.ReactNode;
   contentItem: React.ReactNode;
}
interface AccordionTriggerProps extends Omit<React.ComponentProps<"div">, "value" | "tabIndex"> {
   value: string | number;
}
interface AccordionContentProps extends React.ComponentPropsWithoutRef<"div"> {
   containerClassName?: string;
   value: string | number;
}
const AccordionContext = createContext<ContextType | null>(null);

const Accordion = ({ className = "", ...props }: React.ComponentProps<"div">) => {
   const [isActive, setIsActive] = useState<number | string | null>(null);

   return (
      <AccordionContext.Provider
         value={{
            isActive,
            setActive: (index: number | string | null) => {
               setIsActive((prev) => (prev === index ? null : index));
            },
         }}
      >
         <div className={`${className}`} {...props} />
      </AccordionContext.Provider>
   );
};

function AccordionItem({ className = "", value, triggerItem, contentItem, ...props }: AccordionItemProps) {
   return (
      <li className={`accordion-item ${className}`} {...props}>
         <AccordionTrigger value={value}>{triggerItem}</AccordionTrigger>
         <AccordionContent value={value}>{contentItem}</AccordionContent>
      </li>
   );
}

function AccordionTrigger({ value, onClick, className = "", onKeyDown, ...props }: AccordionTriggerProps) {
   const ctx = useContext(AccordionContext);
   const active = ctx?.isActive === value;

   const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
      ctx?.setActive(value);
      onClick?.(e);
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      const { key } = e;
      if (key === " " || key === "Enter") {
         e.preventDefault();
         ctx?.setActive(value);
      }
   };

   return (
      <div
         className={`accordion-trigger ${className}`}
         onClick={handleOnClick}
         tabIndex={0}
         onKeyDown={handleKeyDown}
         {...props}
      >
         {props.children}
         <Image
            src="/img/icons/close.svg"
            width={24}
            height={25}
            alt="Close Accordion"
            unoptimized
            className={`accordion-trigger__img ${active ? "active" : ""}`}
         />
      </div>
   );
}

function AccordionContent({ className = "", containerClassName = "", value, ...props }: AccordionContentProps) {
   const innerRef = useRef<HTMLParagraphElement>(null);
   const ctx = useContext(AccordionContext);

   const active = ctx?.isActive === value;

   return (
      <div
         className={`${containerClassName} accordion-content__outer ${active ? "active" : ""}`}
         style={{ height: active ? innerRef.current?.offsetHeight ?? "100%" : 0 }}
         aria-hidden={!active}
      >
         <div className={`${className} accordion-content__inner`} ref={innerRef} aria-hidden={!active} {...props} />
      </div>
   );
}

export default Accordion;
export { AccordionItem };
