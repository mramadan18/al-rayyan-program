"use strict";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyText = "No option found.",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.value === value)?.label || value
              : placeholder}
          </span>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    // Logic for matching: cmdk value is usually lowercase
                    const selectedOption = options.find(
                      (o) =>
                        o.value.toLowerCase() === currentValue.toLowerCase(),
                    );
                    if (selectedOption) {
                      onValueChange(selectedOption.value);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex-1 truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
