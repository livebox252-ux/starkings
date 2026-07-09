import { useGetTmdbDiscover } from "@workspace/api-client-react";
import { useParams, useSearch } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { MediaCard, SkeletonCard } from "@/components/ui/MediaCard";
import { useSeo } from "@/hooks/use-seo";
import { MonitorPlay, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PlatformDiscover() {
  const { id } = useParams();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const providerName = params.get('name') || 'Platform';

  useSeo({
    title: `Streaming on ${providerName}`,
    description: `Discover top movies and TV shows currently available on ${providerName}.`,
  });

  const { data: movies, isLoading: loadingMovies } = useGetTmdbDiscover({ 
    type: 'movie', 
    with_watch_providers: id, 
    watch_region: 'US',
    sort_by: 'popularity.desc'
  });

  const { data: tv, isLoading: loadingTv } = useGetTmdbDiscover({ 
    type: 'tv', 
    with_watch_providers: id, 
    watch_region: 'US',
    sort_by: 'popularity.desc'
  });

  const movieResults = movies?.results || [];
  const tvResults = tv?.results || [];

  return (
    <AppLayout>
      <div className="pt-24 pb-8 bg-black/50 border-b border-border">
        <div className="container mx-auto px-4">
          <Link href="/platforms" className="inline-flex items-center text-primary/80 hover:text-primary mb-4 text-sm font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> All Platforms
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <MonitorPlay className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Available on {providerName}</h1>
              <p className="text-muted-foreground text-sm mt-1">Popular movies and TV shows streaming right now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Top Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {loadingMovies
              ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : movieResults.map((item: any) => (
                  <MediaCard key={item.id} {...item} media_type="movie" />
                ))
            }
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Top TV Shows
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {loadingTv
              ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : tvResults.map((item: any) => (
                  <MediaCard key={item.id} {...item} media_type="tv" />
                ))
            }
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
