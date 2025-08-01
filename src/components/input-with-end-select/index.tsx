// Dependencies: pnpm install lucide-react

import { Check, ChevronsUpDown } from "lucide-react";
import { HTMLInputTypeAttribute, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";

interface InputWithEndSelectProps {
  label?: string;
  id: string;
  selectOptions: Array<{ label: React.ReactNode; value: string }>;
  selectPlaceholder?: string;
  inputType?: HTMLInputTypeAttribute;
  placeholder?: string;
  optionValue?: string;
  onChange?: ({ target }: { target: { value: string; name: string } }) => void;
  name: string;
  optionName?: string;
  isValid?: boolean;
  optionIsValid?: boolean;
  value?: string;
  starActive?: boolean;
}

export default function InputWithEndSelect({
  label,
  id,
  selectOptions,
  selectPlaceholder,
  inputType = "text",
  placeholder,
  optionValue,
  onChange,
  name,
  value,
  optionName,
  starActive,
  isValid,
  optionIsValid,
}: InputWithEndSelectProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      {label && (
        <label htmlFor={id} className="label">
          {label} {starActive && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex rounded-lg shadow-sm shadow-black/5">
        <input
          id={id}
          className="input"
          type={inputType}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          defaultValue={value}
        />
        {selectOptions?.length > 0 && (
          <div className="relative inline-flex">
            <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
              <PopoverTrigger className="input flex items-center gap-1 max-w-[100px] md:max-w-[150px]">
                <span className="whitespace-nowrap text-ellipsis overflow-hidden w-full label">
                  {optionValue
                    ? selectOptions.find((item) => item.value === optionValue)
                      ?.label
                    : selectPlaceholder}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {selectOptions.map((item) => (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={() => {
                            onChange?.({
                              target: { value: item?.value, name: optionName as string },
                            });
                            setOpenDropdown(false);
                          }}
                          className="cursor-pointer"
                        >
                          {item.label}
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              optionValue === item.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {(!isValid || !optionIsValid) && (
        <p className="error">
          please enter a valid {label?.toLowerCase() || "name"}
        </p>
      )}
    </>
  );
}
