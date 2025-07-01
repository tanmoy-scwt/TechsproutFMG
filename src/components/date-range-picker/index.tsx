"use client";

import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
   placeholder?: string;
}
export function DatePickerWithRange({ className, placeholder = "Pick a date" }: DatePickerWithRangeProps) {
   const [date, setDate] = useState<DateRange | undefined>({
      from: undefined,
      to: undefined,
   });

   return (
      <div className={cn("grid gap-2 w-full mob:max-w-[277px]", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-full justify-start overflow-hidden", !date && "text-muted-foreground")}
               >
                  <CalendarIcon />
                  <span className="text-left font-normal text-sm text-ellipsis overflow-hidden">
                     {date?.from ? (
                        date.to ? (
                           <>
                              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                           </>
                        ) : (
                           format(date.from, "LLL dd, y")
                        )
                     ) : (
                        placeholder
                     )}
                  </span>
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                  showOutsideDays={false}
                  weekStartsOn={1}
               />
               <PopoverClose className="w-full bg-primary text-white px-4 py-2">Done</PopoverClose>
            </PopoverContent>
         </Popover>
      </div>
   );
}
