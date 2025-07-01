import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";

interface DropdownFilterProps {
   placeholder?: string;
   items: Array<{ label: ReactNode; value: string }>;
   className?: string;
}

function DropdownFilter({ placeholder = "Filter", items, className }: DropdownFilterProps) {
   return (
      <Select>
         <SelectTrigger className={cn("input rounded-none", className)}>
            <SlidersHorizontal size={18} className="mr-2" />
            <SelectValue placeholder={placeholder} />
         </SelectTrigger>
         <SelectContent>
            {items?.map((item) => (
               <SelectItem value={item.value} key={item.value}>
                  {item.label}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   );
}

export default DropdownFilter;
