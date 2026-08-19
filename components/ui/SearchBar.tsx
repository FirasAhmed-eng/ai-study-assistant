import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SearchBar() {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      {/* 3. Search & Action Toolbar */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search sessions..."
          className="pl-8 bg-white"
        />
      </div>

      <Link href="/create" className="w-full sm:w-auto">
        <Button size="default" className="w-full sm:w-auto flex gap-2">
          <Plus className="h-4 w-4" />
          New Study Session
        </Button>
      </Link>
    </div>
  );
}

export default SearchBar;
