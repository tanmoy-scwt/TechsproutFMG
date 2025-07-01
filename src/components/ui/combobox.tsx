"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ComboboxData = Array<{
   value: string;
   label: React.ReactNode;
}>;

interface ComboboxProps {
   data: ComboboxData;
   dataLoading?: boolean;
   dropdownPlaceholder?: string;
   inputPlaceholder?: string;
   notFoundMessage?: string;
   label?: string;
   labelClassName?: string;
   onChange?: ({ target }: { target: { value: string; name: string } }) => void;
   name?: string;
   onSelect?: (v: string) => void;
   value?: string | null;
   onSearchValueChange?: (searchValue: string) => void;
}

export default function Combobox({
   data,
   dataLoading,
   dropdownPlaceholder = "Please Select...",
   inputPlaceholder = "Search here...",
   notFoundMessage,
   label,
   labelClassName,
   value,
   onChange,
   name,
   onSelect,
}: ComboboxProps) {
   const [open, setOpen] = React.useState(false);

   const handleLabelClick = () => {
      setOpen(true);
   };

   return (
      <>
         {label && (
            <div onClick={handleLabelClick} className={`label ${labelClassName || ""} !pb-[3px]`}>
               {label}
            </div>
         )}
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="input flex items-center gap-1 justify-between">
               <span className="block whitespace-nowrap text-ellipsis overflow-hidden label">
                  {value ? data?.find((item) => item.value === value)?.label : dropdownPlaceholder}
               </span>
               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="p-0">
               <Command
                  className="w-full"
                  filter={(value, search) => {
                     //%$% - Separator to separate label and value used as value as search input searches based on value and we want to use value as value and not the label as value.
                     const label = value?.split("%$%")?.[1];
                     if (label.toLowerCase().includes(search.toLowerCase())) return 1;
                     return 0;
                  }}
               >
                  <CommandInput placeholder={inputPlaceholder} disabled={dataLoading} />
                  {dataLoading ? (
                     <span className="text-[14px] py-2 px-6">Loading...</span>
                  ) : (
                     <CommandList>
                        <CommandEmpty>{notFoundMessage || "No result found."}</CommandEmpty>
                        <CommandGroup>
                           {data.map((item) => (
                              <CommandItem
                                 key={item.label as string}
                                 //%$% - Separator to separate label and value used as value as search input searches based on value and we want to use value as value and not the label as value.
                                 value={`${item.value}%$%${item.label}`}
                                 onSelect={() => {
                                    onSelect?.(item.value);
                                    onChange?.({ target: { value: item?.value, name: name || "" } });
                                    setOpen(false);
                                 }}
                                 className="cursor-pointer"
                              >
                                 <Check
                                    className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")}
                                 />
                                 {item.label}
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     </CommandList>
                  )}
               </Command>
            </PopoverContent>
         </Popover>
      </>
   );
}
