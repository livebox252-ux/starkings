import { Link } from "wouter";
import { Star, Calendar, Tv, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

interface MediaCardProps {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv' | 'person';
  // Extra detail for landscape logos
  images?: { logos?: any[] };
}

export function MediaCard({ 
  id, title, name, poster_path, backdrop_path, vote_average, release_date, first_air_date, media_type = 'movie', images 
}: MediaCardProps) {
  const { posterStyle } = useTheme();
  
  const displayTitle = title || name || "Unknown";
  const date = release_date || first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const rating = vote_average ? vote_average.toFixed(1) : null;
  
  const linkPrefix = media_type === 'person' ? '/person' : `/watch/${media_type}`;
  const href = `${linkPrefix}/${id}`;

  const isLandscape = posterStyle === 'landscape' && media_type !== 'person';
  const imgPath = isLandscape ? (backdrop_path || poster_path) : poster_path;
  
  // Find an english logo if available, or first available
  const logos = images?.logos || [];
  const enLogo = logos.find((l: any) => l.iso_639_1 === 'en' && l.file_path.endsWith('.png'));
  const logoToUse = enLogo || logos.find((l: any) => l.file_path?.endsWith('.png'));

  return (
    <Link href={href} className="group block w-full">
      <div className={cn(
        "relative rounded-xl overflow-hidden bg-muted card-hover ring-1 ring-border/50",
        isLandscape ? "aspect-video" : "aspect-[2/3]"
      )}>
        {imgPath ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${imgPath}`} 
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            {media_type === 'movie' ? <Film className="w-10 h-10 opacity-20" /> : <Tv className="w-10 h-10 opacity-20" />}
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t transition-opacity duration-300",
          isLandscape 
            ? "from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100" 
            : "from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100"
        )} />
        
        {/* Landscape special elements: Logo or prominent title */}
        {isLandscape && (
          <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
            {logoToUse ? (
              <img 
                src={`https://image.tmdb.org/t/p/w300${logoToUse.file_path}`}
                alt={displayTitle}
                className="w-3/4 max-h-12 object-contain object-left mb-2 transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-md"
              />
            ) : (
              <h3 className="text-white font-bold text-base md:text-lg line-clamp-1 mb-1 drop-shadow-md">
                {displayTitle}
              </h3>
            )}
            
            <div className="flex items-center gap-3 text-xs font-medium text-white/90 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              {rating && (
                <span className="flex items-center gap-1 text-primary">
                  <Star className="w-3 h-3 fill-current" />
                  {rating}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {year}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Portrait Hover Content */}
        {!isLandscape && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-3 text-xs font-medium text-white mb-1">
              {rating && (
                <span className="flex items-center gap-1 text-primary drop-shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  {rating}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1 text-white/90 drop-shadow-md">
                  <Calendar className="w-3 h-3" />
                  {year}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Badges */}
        {media_type === 'tv' && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold tracking-wider text-white shadow-sm ring-1 ring-white/10">
            TV
          </div>
        )}
      </div>
      
      {!isLandscape && (
        <div className="mt-3 px-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {displayTitle}
          </h3>
        </div>
      )}
    </Link>
  );
}

export function SkeletonCard() {
  const { posterStyle } = useTheme();
  const isLandscape = posterStyle === 'landscape';
  
  return (
    <div className="w-full">
      <div className={cn("rounded-xl bg-muted animate-pulse mb-3", 
        isLandscape ? "aspect-video" : "aspect-[2/3]"
      )} />
      {!isLandscape && <div className="h-4 bg-muted rounded w-3/4 animate-pulse mx-1" />}
    </div>
  );
}
