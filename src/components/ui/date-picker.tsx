"use client";

import React, { Dispatch, SetStateAction, useRef, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
   placeholder?: string;
   minDate?: Date;
   maxDate?: Date;
   label?: string;
   date: Date | undefined;
   setDate: Dispatch<SetStateAction<Date | undefined>>;
   disabled?: boolean;
}
export default function DatePicker({
   className,
   placeholder = "Pick a date",
   minDate,
   maxDate,
   label,
   date,
   setDate,
   disabled,
}: DatePickerWithRangeProps) {
   const closeRef = useRef<HTMLButtonElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);

   return (
      <div className={cn("flex mob:items-center w-full flex-col mob:flex-row", className)}>
         {label && (
            <p
               className={cn("label", "mb-1 mob:mb-0 mob:mr-3")}
               onClick={() => {
                  triggerRef.current?.click();
               }}
            >
               {label}
            </p>
         )}
         <div className="w-full">
            <Popover>
               <PopoverTrigger asChild disabled={disabled}>
                  <Button
                     id="date"
                     variant={"outline"}
                     className={cn(
                        "w-full justify-start overflow-hidden input rounded-[0!important]",
                        !date && "text-muted-foreground"
                     )}
                     ref={triggerRef}
                  >
                     <CalendarIcon />
                     <span
                        className={`text-left font-normal text-sm text-ellipsis overflow-hidden ${
                           !date ? "label" : ""
                        }`}
                     >
                        {date ? format(date, "dd LLL y") : placeholder}
                     </span>
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                     initialFocus
                     mode="single"
                     selected={date}
                     onSelect={setDate}
                     numberOfMonths={1}
                     showOutsideDays={false}
                     weekStartsOn={1}
                     onDayClick={() => {
                        closeRef.current?.click();
                     }}
                     fromDate={minDate}
                     toDate={maxDate}
                  />
               </PopoverContent>
               <PopoverClose ref={closeRef} />
            </Popover>
         </div>
      </div>
   );
}
