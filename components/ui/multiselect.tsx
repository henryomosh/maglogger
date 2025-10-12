//@ts-nocheck

// components/ControlledMultiSelect.jsx
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Portal } from "@radix-ui/react-popover";
import { Command, CommandGroup, CommandItem, CommandList } from "cmdk";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";

// Placeholder for styling, replace with your actual class names
const styles = {
  trigger:
    "flex items-center justify-between p-2 w-full border border-blue-500 rounded-md  ",
  content:
    "bg-white border rounded-md p-1  shadow-lg w-48  relative z-50 overflow-x-hidden overflow-y-auto  ",
  commandItem:
    "flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-md text-sm",
  badge: "bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-xs m-1",
};

export function ControlledMultiSelect({
  options,
  placeholder,
  value, // The controlled value (an array of strings)
  onValueChange, // The function to update the controlled value
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue) => {
    onValueChange((prev) => {
      if (prev.includes(selectedValue)) {
        return prev.filter((v) => v !== selectedValue);
      } else {
        return [...prev, selectedValue];
      }
    });
  };

  const selectedLabels = value.map(
    (v) => options.find((o) => o.value === v)?.label
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className={styles.trigger}>
          {selectedLabels.length > 0 ? (
            <div className="flex flex-wrap items-center">
              {selectedLabels.map((label, index) => (
                <span key={index} className={styles.badge}>
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">{placeholder}</span>
          )}
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>

      <Popover.Content
        className={`${styles.content} relative pt-6 pb-6 z-50 top-30 left-20 h-64`}
        sideOffset={5}
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={styles.commandItem}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {value.includes(option.value) && (
                      <CheckIcon className="ml-2 text-blue-600 h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}
