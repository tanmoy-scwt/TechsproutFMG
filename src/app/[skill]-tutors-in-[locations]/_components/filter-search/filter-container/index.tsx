"use client";

import Image from "next/image";
import "./style.css";
import React, { PropsWithChildren, useRef, useState } from "react";

interface FilterContainerProps extends PropsWithChildren {
   title: string;
}

function FilterContainer({ title, children }: FilterContainerProps) {
   const [showChild, setShowChild] = useState(false);
   const childRef = useRef<HTMLDivElement>(null);
   const childHeight = showChild ? childRef.current?.offsetHeight ?? "100%" : 0;

   const handleToggle = () => {
      setShowChild((prev) => !prev);
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
      const { key } = e;

      if (key === "Enter") {
         e.preventDefault();
         handleToggle();
      }
   };

   return (
      <div className="filter-container">
         <p
            className={`filter-container__title ${showChild ? "brd" : ""}`}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={0}
         >
            {title} <Image src="/img/icons/down-arrow.svg" alt={`Toggle ${title} Filter`} width={15} height={15} />
         </p>
         <div className="filter-container__child" style={{ height: childHeight }} aria-hidden={!showChild}>
            <div ref={childRef} className="filter-container__child--inner" aria-hidden={!showChild}>
               {children}
            </div>
         </div>
      </div>
   );
}

export default FilterContainer;
