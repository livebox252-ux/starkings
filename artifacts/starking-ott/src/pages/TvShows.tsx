import { useState } from "react";
import { useGetTmdbGenres, useGetTmdbDiscover } from "@workspace/api-client-react";
import { MediaCard, SkeletonCard } from "@/components/ui/MediaCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";

export default function TvShows() {
  useSeo({
    title: "Browse TV Shows",
    description: "Discover binge-worthy TV shows on Star King OTT. Filter by your favorite genres.",
  });

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data: genres } = useGetTmdbGenres();
  
  const { data, isLoading, isFetching } = useGetTmdbDiscover({
    type: "tv",
    with_genres: selectedGenre || undefined,
    page: page.toString(),
  });

  const tvGenres = genres?.tv || [];

  return (
    <AppLayout>
      <div className="pt-24 pb-12 px-4 md:px-6 container mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">TV Shows</h1>
        
        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-white/10">
          <button
            onClick={() => { setSelectedGenre(""); setPage(1); }}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              selectedGenre === "" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All
          </button>
          {tvGenres.map((g) => (
            <button
              key={g.id}
              onClick={() => { setSelectedGenre(g.id.toString()); setPage(1); }}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedGenre === g.id.toString()
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {isLoading ? (
            Array(18).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            data?.results?.map((item) => (
              <MediaCard key={item.id} {...item as any} media_type="tv" />
            ))
          )}
        </div>

        {/* Pagination */}
        {data?.total_pages && data.total_pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-6 py-2 rounded bg-secondary disabled:opacity-50 hover:bg-secondary/80 transition-colors"
            >
              Previous
            </button>
            <span className="text-muted-foreground">Page {page} of {Math.min(data.total_pages, 500)}</span>
            <button
              disabled={page >= Math.min(data.total_pages, 500) || isFetching}
              onClick={() => setPage(p => p + 1)}
              className="px-6 py-2 rounded bg-secondary disabled:opacity-50 hover:bg-secondary/80 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
