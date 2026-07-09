import { useGetTmdbTrending, useGetTmdbDiscover, useGetTmdbAnime } from "@workspace/api-client-react";
import { MediaCard, SkeletonCard } from "@/components/ui/MediaCard";
import { MediaRow } from "@/components/ui/MediaRow";
import { HeroParallax, SkeletonHero } from "@/components/ui/HeroParallax";
import { useSeo } from "@/hooks/use-seo";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Home() {
  useSeo({
    title: "Watch Free Movies & TV Shows",
    description: "Star King OTT offers free premium streaming for movies, tv shows, and anime. Discover your next favorite cinematic experience.",
  });

  // Fetch data
  const { data: trendingAll, isLoading: loadingTrending } = useGetTmdbTrending({ type: 'all' });
  const { data: popularMovies, isLoading: loadingMovies } = useGetTmdbDiscover({ type: 'movie', sort_by: 'popularity.desc' });
  const { data: popularTv, isLoading: loadingTv } = useGetTmdbDiscover({ type: 'tv', sort_by: 'popularity.desc' });
  const { data: anime, isLoading: loadingAnime } = useGetTmdbAnime({});

  const heroItems = (trendingAll?.results as any[] | undefined)
    ?.filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 5) || [];

  return (
    <AppLayout>
      {/* Schema Markup for Home Page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Star King OTT",
          "url": window.location.origin,
          "description": "Premium cinematic streaming for movies, TV shows, and anime.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* SEO hidden description */}
      <div className="sr-only">
        Star King OTT is a premium streaming platform offering a vast collection of movies, TV shows, and anime. Enjoy high-quality streaming of the latest trending releases and timeless classics, all beautifully presented in a cinematic dark mode interface.
      </div>

      {loadingTrending ? (
        <SkeletonHero />
      ) : (
        <HeroParallax items={heroItems as any[]} />
      )}

      <div className="container mx-auto pb-20 mt-10 md:-mt-20 relative z-20 space-y-8">
        {/* Trending Now */}
        <MediaRow title="Trending This Week">
          {loadingTrending
            ? Array(6).fill(0).map((_, i) => <div key={i} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start"><SkeletonCard /></div>)
            : trendingAll?.results?.map((item: any) => (
                <div key={item.id} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                  <MediaCard {...item as any} />
                </div>
              ))}
        </MediaRow>

        {/* Popular Movies */}
        <MediaRow title="Popular Movies">
          {loadingMovies
            ? Array(6).fill(0).map((_, i) => <div key={i} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start"><SkeletonCard /></div>)
            : popularMovies?.results?.map((item: any) => (
                <div key={item.id} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                  <MediaCard {...item as any} media_type="movie" />
                </div>
              ))}
        </MediaRow>

        {/* Popular TV Shows */}
        <MediaRow title="Binge-Worthy TV">
          {loadingTv
            ? Array(6).fill(0).map((_, i) => <div key={i} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start"><SkeletonCard /></div>)
            : popularTv?.results?.map((item: any) => (
                <div key={item.id} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                  <MediaCard {...item as any} media_type="tv" />
                </div>
              ))}
        </MediaRow>

        {/* Anime */}
        <MediaRow title="Anime Essentials">
          {loadingAnime
            ? Array(6).fill(0).map((_, i) => <div key={i} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start"><SkeletonCard /></div>)
            : anime?.results?.map((item: any) => (
                <div key={item.id} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                  <MediaCard {...item as any} media_type={item.first_air_date ? 'tv' : 'movie'} />
                </div>
              ))}
        </MediaRow>
      </div>
    </AppLayout>
  );
}
