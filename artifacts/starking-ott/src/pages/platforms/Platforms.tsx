import { useGetTmdbProviders } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSeo } from "@/hooks/use-seo";
import { Link } from "wouter";
import { MonitorPlay } from "lucide-react";

export default function Platforms() {
  useSeo({
    title: "Browse by Streaming Platform",
    description: "Discover movies and TV shows available on your favorite streaming platforms like Netflix, Prime Video, Disney+, and more.",
  });

  // TMDB Providers API takes watch_region
  const { data: movieProviders, isLoading: isLoadingMovies } = useGetTmdbProviders({ watch_region: 'US' });
  
  // Combine and deduplicate
  const providers = (movieProviders?.results as any[]) || [];
  
  // Sort by display priority (TMDB returns them mostly sorted by popularity)
  const sortedProviders = [...providers].sort((a, b) => a.display_priority - b.display_priority).slice(0, 48);

  return (
    <AppLayout>
      <div className="pt-24 pb-12 bg-black/50 border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <MonitorPlay className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">Streaming Platforms</h1>
          <p className="text-lg text-muted-foreground">Find what to watch based on the services you already subscribe to.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoadingMovies ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Array(24).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
            {sortedProviders.map((provider) => (
              <Link 
                key={provider.provider_id} 
                href={`/platforms/${provider.provider_id}?name=${encodeURIComponent(provider.provider_name)}`}
                className="group flex flex-col items-center gap-3"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border shadow-sm group-hover:shadow-xl group-hover:scale-105 group-hover:border-primary/50 transition-all duration-300">
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`} 
                    alt={provider.provider_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {provider.provider_name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
