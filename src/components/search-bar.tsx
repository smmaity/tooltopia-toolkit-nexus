
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ className, placeholder = "Search for any tool...", onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        "relative flex w-full max-w-lg items-center space-x-2", 
        className
      )}
    >
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 h-12 rounded-full pr-20 sm:pr-32 bg-background border-input shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit" 
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full text-sm sm:text-base px-3 sm:px-6"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
