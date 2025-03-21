"use client";

import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

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
import { ListItem } from "./list-item";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  heading: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  heading,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filtered, setFiltered] = React.useState<
    { label: string; value: string }[]
  >([]);

  const handleSearchTerm = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFiltered(
      options.filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const displayedOptions = searchTerm === "" ? options : filtered;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label ||
              "Select Option.."
            : "Select Option.."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:min-w-96">
        <Command>
          <div className="w-full px-2 py-1 flex items-center border rounded-md">
            <Search className="mr-2 h-4 w-4 min-w-4" />
            <input
              type="text"
              placeholder="Search Category"
              onChange={handleSearchTerm}
              className="flex w-full outline-none text-sm py-1"
            />
          </div>
          <CommandList>
            <CommandGroup heading={heading}>
              {displayedOptions.length > 0 ? (
                displayedOptions.map((option) => (
                  <ListItem
                    key={option.value}
                    category={option}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    isChecked={option?.value === value}
                  />
                ))
              ) : (
                <CommandEmpty>No Category Found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
