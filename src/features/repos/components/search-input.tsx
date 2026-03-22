"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ISearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: ISearchInputProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search repositories..."
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value === "" ? e.target.value.trim() : e.target.value,
          )
        }
        className="pl-10 rounded-lg bg-background/80 backdrop-blur-sm border-border/50 focus-visible:border-primary/30"
      />
    </div>
  );
};
