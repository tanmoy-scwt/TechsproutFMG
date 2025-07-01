"use client";

import "./style.css";
import DatePicker from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";

type DateValue = Date | undefined;

interface DateFilterProps {
   fromDate: DateValue | undefined;
   setFromDate: Dispatch<SetStateAction<DateValue>>;
   toDate: DateValue | undefined;
   setToDate: Dispatch<SetStateAction<DateValue>>;
   fromLabel?: string;
   toLabel?: string;
   className?: string;
}

function DateFilter({ fromDate, setFromDate, toDate, setToDate, fromLabel, toLabel, className = "" }: DateFilterProps) {
   const [] = useState<DateValue>();
   const [] = useState<DateValue>();

   const maxFromDate = toDate ? new Date(toDate) : undefined;
   const minToDate = fromDate ? new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() + 1)) : undefined;

   return (
      <div className={cn("date-filter", className)}>
         <DatePicker label={fromLabel} maxDate={maxFromDate} date={fromDate} setDate={setFromDate} />
         <DatePicker
            label={toLabel}
            minDate={minToDate}
            maxDate={new Date()}
            date={toDate}
            setDate={setToDate}
            disabled={!fromDate}
         />
      </div>
   );
}

export default DateFilter;
