"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

type Option = { label: string; value: string };

type AppSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export function AppSelect({ label, value, onChange, options }: AppSelectProps) {
  return (
    <label className="space-y-2 text-sm text-zinc-300">
      <span>{label}</span>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 text-zinc-100" aria-label={label}>
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="z-50 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-noir">
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value} className="relative flex cursor-pointer items-center rounded-lg px-8 py-2 text-sm text-zinc-100 outline-none data-[highlighted]:bg-zinc-700">
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check size={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  );
}
