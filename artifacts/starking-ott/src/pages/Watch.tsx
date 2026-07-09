import { useGetTmdbDetails, useGetTmdbSeason, useGetTmdbWatchProviders } from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Player } from "@/components/ui/Player";
import { MediaRow } from "@/components/ui/MediaRow";
import { MediaCard } from "@/components/ui/MediaCard";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { useSeo } from "@/hooks/use-seo";
import { Star, Calendar, Clock, Film, PlayCircle, Quote, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Watch() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const type = window.location.pathname.startsWith('/watch/tv') ? 'tv' : 'movie';
  const id = params.id as string;
  
  const currentSeason = params.season || "1";
  const currentEpisode = params.episode || "1";

  const { data, isLoading, error } = useGetTmdbDetails(type, id, { 
    query: { enabled: !!id, queryKey: ['details', type, id] } 
  });

  const { data: seasonData } = useGetTmdbSeason(id, currentSeason, {
    query: { enabled: type === 'tv' && !!id && !!currentSeason, queryKey: ['season', id, currentSeason] }
  });

  const { data: providersData } = useGetTmdbWatchProviders(type, id, {
    query: { enabled: !!id, queryKey: ['providers', type, id] }
  });

  const details = data?.details as any;
  const credits = (data?.credits as any)?.cast || [];
  const crew = (data?.credits as any)?.crew || [];
  const similar = (data?.similar as any)?.results || [];
  const recommendations = (data?.recommendations as any)?.results || [];
  const videos = (data?.videos as any)?.results || [];
  const reviews = (data?.reviews as any)?.results || [];
  const images = (data?.images as any)?.logos || [];
  
  const episodes = (seasonData as any)?.episodes || [];

  const watchProviders = (providersData as any)?.results?.['IN']?.flatrate 
    || (providersData as any)?.results?.['US']?.flatrate 
    || [];

  useSeo({
    title: details?.title || details?.name || "Watch",
    description: details?.overview,
    image: details?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : undefined,
    type: type === 'movie' ? 'video.movie' : 'video.tv_show'
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse">
          <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-muted" />
          <div className="container mx-auto px-4 py-8">
            <div className="h-10 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !details) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <h2 className="text-2xl font-bold mb-2">Media Not Found</h2>
          <p className="text-muted-foreground mb-4">We couldn't load this title.</p>
          <Link href="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </AppLayout>
    );
  }

  const title = details.title || details.name;
  const year = new Date(details.release_date || details.first_air_date || "").getFullYear();
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const fullDate = details.release_date || details.first_air_date;

  const enLogo = images.find((l: any) => l.iso_639_1 === 'en' && l.file_path.endsWith('.png'));
  const logoToUse = enLogo || images.find((l: any) => l.file_path?.endsWith('.png'));

  const directors = crew.filter((c: any) => c.job === 'Director');
  const writers = crew.filter((c: any) => c.department === 'Writing' || c.job === 'Writer');

  const youtubeVideos = videos.filter((v: any) => v.site === 'YouTube').slice(0, 4);

  return (
    <AppLayout>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'movie' ? "Movie" : "TVSeries",
          "name": title,
          "image": `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`,
          "description": details.overview,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": details.vote_average,
            "bestRating": "10",
            "ratingCount": details.vote_count
          }
        })}
      </script>

      {/* Hero Section with Backdrop */}
      <div className="relative w-full aspect-square md:aspect-[21/9] lg:aspect-[3/1] bg-black group">
        <div className="absolute inset-0">
          <img 
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-end pb-8">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8 items-end">
            <div className="hidden md:block w-48 lg:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-10 translate-y-16">
              {details.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center"><Film className="w-12 h-12 opacity-20" /></div>
              )}
            </div>

            <div className="flex-1 space-y-4 z-10">
              {logoToUse ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${logoToUse.file_path}`}
                  alt={title}
                  className="max-w-[250px] md:max-w-[400px] object-contain object-left drop-shadow-2xl"
                />
              ) : (
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white text-shadow">
                  {title}
                </h1>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
                {details.vote_average > 0 && (
                  <div className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-md backdrop-blur-sm border border-primary/20">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {details.vote_average.toFixed(1)}
                  </div>
                )}
                {year && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> {year}
                  </div>
                )}
                {runtime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> {runtime}
                  </div>
                )}
                {type === 'tv' && details.number_of_seasons && (
                  <div className="px-2 py-1 rounded border border-white/20 bg-black/40 backdrop-blur-sm">
                    {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}
                  </div>
                )}
                <div className="flex gap-2">
                  {details.genres?.map((g: any) => (
                    <span key={g.id} className="px-2 py-1 rounded-full bg-secondary/80 backdrop-blur-sm text-xs border border-white/5">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              {watchProviders.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-muted-foreground">Available on:</span>
                  <div className="flex gap-2">
                    {watchProviders.slice(0, 4).map((p: any) => (
                      <img 
                        key={p.provider_id}
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} 
                        alt={p.provider_name}
                        className="w-6 h-6 rounded-md shadow-sm"
                        title={p.provider_name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 shrink-0 z-10 w-full md:w-auto mt-4 md:mt-0 pb-4">
              <Button asChild size="lg" className="rounded-full shadow-xl shadow-primary/20">
                <Link href={`/player/${type}/${id}${type === 'tv' ? `/${currentSeason}/${currentEpisode}` : ''}`}>
                  <Maximize className="w-5 h-5 mr-2" /> Full Screen Player
                </Link>
              </Button>
              <ShareButtons title={title} text={details.overview} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Embedded Player */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-primary" /> Watch Now
              </h2>
              <Player 
                tmdbId={id} 
                type={type} 
                season={type === 'tv' ? currentSeason : undefined} 
                episode={type === 'tv' ? currentEpisode : undefined} 
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-border pb-2">Overview</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {details.overview || "No overview available."}
              </p>
            </div>

            {/* TV Show Episode Selector */}
            {type === 'tv' && details.seasons && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-xl font-bold">Episodes</h3>
                  <select 
                    className="bg-secondary border border-border rounded p-1.5 text-sm focus:ring-primary focus:border-primary"
                    value={currentSeason}
                    onChange={(e) => setLocation(`/watch/tv/${id}/${e.target.value}/1`)}
                  >
                    {details.seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                      <option key={s.season_number} value={s.season_number}>
                        Season {s.season_number}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {episodes.length > 0 ? (
                    episodes.map((ep: any) => (
                      <Link 
                        key={ep.id}
                        href={`/watch/tv/${id}/${currentSeason}/${ep.episode_number}`}
                        className={cn(
                          "flex flex-col gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent/5 transition-all group",
                          currentEpisode === ep.episode_number.toString() ? "ring-1 ring-primary bg-primary/5" : ""
                        )}
                      >
                        <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden shrink-0">
                          {ep.still_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} 
                              alt={ep.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-background"><Film className="w-8 h-8 opacity-10" /></div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white">
                            S{currentSeason} E{ep.episode_number}
                          </div>
                          {currentEpisode === ep.episode_number.toString() && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">Playing</div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {ep.episode_number}. {ep.name}
                            </h4>
                            {ep.air_date && <span className="text-[10px] text-muted-foreground shrink-0">{ep.air_date}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {ep.overview || "No description available."}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 p-8 text-center text-muted-foreground animate-pulse">Loading episodes...</div>
                  )}
                </div>
              </div>
            )}

            {/* Cast */}
            {credits && credits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-border pb-2">Top Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {credits.slice(0, 10).map((person: any) => (
                    <Link key={person.id} href={`/person/${person.id}`} className="group block">
                      <div className="aspect-[2/3] rounded-xl bg-muted mb-2 overflow-hidden border border-border group-hover:border-primary/50 group-hover:shadow-lg transition-all">
                        {person.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                            alt={person.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary"><span className="text-xs text-muted-foreground">No image</span></div>
                        )}
                      </div>
                      <p className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{person.name}</p>
                      <p className="text-xs text-muted-foreground leading-tight mt-0.5">{person.character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Videos/Trailers */}
            {youtubeVideos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-border pb-2">Videos & Trailers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {youtubeVideos.map((video: any) => (
                    <div key={video.id} className="space-y-2">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          title={video.name}
                        />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground line-clamp-1">{video.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-border pb-2">User Reviews</h3>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review: any) => (
                    <div key={review.id} className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{review.author}</p>
                          {review.author_details?.rating && (
                            <p className="text-xs text-primary flex items-center"><Star className="w-3 h-3 mr-1 fill-current" /> {review.author_details.rating}/10</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-4 italic"><Quote className="w-3 h-3 inline mr-1 opacity-50" />{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Information</h3>
              <dl className="space-y-4 text-sm">
                {fullDate && (
                  <div>
                    <dt className="text-muted-foreground mb-1">{type === 'movie' ? 'Release Date' : 'First Air Date'}</dt>
                    <dd className="font-medium text-foreground">{fullDate}</dd>
                  </div>
                )}
                {details.status && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Status</dt>
                    <dd className="font-medium text-foreground">{details.status}</dd>
                  </div>
                )}
                {details.original_language && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Language</dt>
                    <dd className="font-medium text-foreground uppercase">{details.original_language}</dd>
                  </div>
                )}
                {directors.length > 0 && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Director</dt>
                    <dd className="font-medium text-foreground">
                      {directors.map((c: any) => c.name).join(', ')}
                    </dd>
                  </div>
                )}
                {writers.length > 0 && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Writer</dt>
                    <dd className="font-medium text-foreground">
                      {writers.map((c: any) => c.name).join(', ')}
                    </dd>
                  </div>
                )}
                {details.production_companies?.length > 0 && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Production</dt>
                    <dd className="font-medium text-foreground">
                      {details.production_companies.map((c: any) => c.name).join(', ')}
                    </dd>
                  </div>
                )}
                {type === 'movie' && details.budget > 0 && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Budget</dt>
                    <dd className="font-medium text-foreground">${(details.budget / 1000000).toFixed(1)}M</dd>
                  </div>
                )}
              </dl>
            </div>
            
            {details.belongs_to_collection && (
              <Link href={`/collection/${details.belongs_to_collection.id}`} className="block relative rounded-2xl overflow-hidden group border border-border shadow-sm">
                <div className="aspect-[16/9]">
                  {details.belongs_to_collection.backdrop_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${details.belongs_to_collection.backdrop_path}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Collection"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center"><Film className="w-8 h-8 opacity-20" /></div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] text-primary font-bold tracking-widest mb-1 uppercase">Part of</p>
                  <h4 className="font-bold text-white group-hover:text-primary transition-colors leading-tight">{details.belongs_to_collection.name}</h4>
                </div>
              </Link>
            )}
          </div>
          
        </div>
      </div>

      {/* Recommendations & Similar */}
      <div className="container mx-auto px-4 md:px-6 pb-20 space-y-12">
        {recommendations.length > 0 && (
          <MediaRow title="Recommended For You">
            {recommendations.slice(0, 15).map((item: any) => (
              <div key={item.id} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                <MediaCard {...item} media_type={type} />
              </div>
            ))}
          </MediaRow>
        )}

        {similar.length > 0 && (
          <MediaRow title="Similar Titles">
            {similar.slice(0, 15).map((item: any) => (
              <div key={item.id} className="min-w-[150px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                <MediaCard {...item} media_type={type} />
              </div>
            ))}
          </MediaRow>
        )}
      </div>
      
    </AppLayout>
  );
}
