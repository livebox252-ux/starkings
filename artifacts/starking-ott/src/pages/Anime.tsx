import { useState } from "react";
import { useGetTmdbAnime } from "@workspace/api-client-react";
import { MediaCard, SkeletonCard } from "@/components/ui/MediaCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";

export default function Anime() {
  useSeo({
    title: "Anime",
    description: "Watch the best Japanese anime series and movies on Star King OTT.",
  });

  const [type, setType] = useState<'tv' | 'movie'>('tv');
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isFetching } = useGetTmdbAnime({
    type,
    page: page.toString(),
  });

  return (
    <AppLayout>
      <div className="pt-24 pb-12 px-4 md:px-6 container mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Anime</h1>
        
        {/* Type Filter */}
        <div className="flex gap-2 mb-10 pb-2 border-b border-white/10">
          <button
            onClick={() => { setType('tv'); setPage(1); }}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-colors",
              type === 'tv' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            TV Series
          </button>
          <button
            onClick={() => { setType('movie'); setPage(1); }}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-colors",
              type === 'movie' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Movies
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {isLoading ? (
            Array(18).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            data?.results?.map((item) => (
              <MediaCard key={item.id} {...item as any} media_type={type} />
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
