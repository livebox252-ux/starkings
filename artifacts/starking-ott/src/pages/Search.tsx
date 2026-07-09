import { useState, useEffect } from "react";
import { useGetTmdbSearch } from "@workspace/api-client-react";
import { MediaCard, SkeletonCard } from "@/components/ui/MediaCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSeo } from "@/hooks/use-seo";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Search() {
  useSeo({
    title: "Search",
    description: "Search for movies, TV shows, and people on Star King OTT.",
  });

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);
  
  const { data, isLoading } = useGetTmdbSearch(
    { query: debouncedQuery }, 
    { query: { enabled: debouncedQuery.length > 1, queryKey: ['search', debouncedQuery] } }
  );

  return (
    <AppLayout>
      <div className="pt-24 pb-12 px-4 md:px-6 container mx-auto min-h-[80vh]">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
            <Input 
              type="text" 
              placeholder="Search for movies, tv shows, people..." 
              className="w-full h-16 pl-14 text-xl rounded-full bg-secondary border-none focus-visible:ring-primary focus-visible:ring-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {debouncedQuery.length > 1 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Results for <span className="text-primary">"{debouncedQuery}"</span>
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : data?.results?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {data.results.map((item) => (
                  <MediaCard key={item.id} {...item as any} media_type={item.media_type as any} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-xl mb-2">No results found</p>
                <p>Try different keywords or check spelling.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/50">
            <SearchIcon className="w-20 h-20 mb-4 opacity-50" />
            <p className="text-xl">Find your next favorite story</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
