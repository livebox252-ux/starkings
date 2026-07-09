import { useParams, Link, useLocation } from "wouter";
import { useGetTmdbDetails, useGetTmdbSeason } from "@workspace/api-client-react";
import { useSeo } from "@/hooks/use-seo";
import { ArrowLeft, Server, MonitorPlay, ListVideo, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TvPlayer() {
  const { id, season, episode } = useParams();
  const [, setLocation] = useLocation();
  const [server, setServer] = useState<1 | 2>(1);
  const [showEpisodes, setShowEpisodes] = useState(false);

  const { data: detailsData } = useGetTmdbDetails('tv', id as string, {
    query: { enabled: !!id, queryKey: ['details', 'tv', id] }
  });

  const { data: seasonData } = useGetTmdbSeason(id as string, season as string, {
    query: { enabled: !!id && !!season, queryKey: ['season', id, season] }
  });

  const details = detailsData?.details as any;
  const episodes = (seasonData as any)?.episodes || [];
  
  const title = details?.name || "TV Show";
  const currentEpData = episodes.find((e: any) => e.episode_number.toString() === episode);
  const epName = currentEpData?.name || `Episode ${episode}`;

  // Find next episode
  const currentEpIndex = episodes.findIndex((e: any) => e.episode_number.toString() === episode);
  const nextEpisode = currentEpIndex >= 0 && currentEpIndex < episodes.length - 1 
    ? episodes[currentEpIndex + 1] 
    : null;

  useSeo({
    title: `Watching ${title} S${season} E${episode}`,
    description: `Full screen player for ${title}`,
  });

  const getServerUrl = (serverId: number) => {
    return serverId === 1
      ? `https://vidsrc.sbs/embed/tv/${id}/${season}/${episode}`
      : `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}`;
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      setLocation(`/player/tv/${id}/${season}/${nextEpisode.episode_number}`);
    }
  };

  return (
    <div className="w-[100dvw] h-[100dvh] bg-black text-white flex flex-col overflow-hidden selection:bg-primary/30 selection:text-primary dark theme-gold">
      
      {/* Title Bar (Appears on hover) */}
      <div className="h-16 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between px-4 shrink-0 absolute top-0 left-0 right-0 z-20 transition-opacity duration-300 opacity-0 hover:opacity-100 focus-within:opacity-100">
        <div className="flex items-center gap-4">
          <Link href={`/watch/tv/${id}/${season}/${episode}`} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-tight line-clamp-1">{title}</h1>
            <p className="text-xs text-white/70">Season {season} • Episode {episode}: {epName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {nextEpisode && (
            <button 
              onClick={handleNextEpisode}
              className="hidden sm:flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
            >
              Next Ep <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={() => setShowEpisodes(!showEpisodes)}
            className={cn("px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2",
              showEpisodes ? "bg-primary text-primary-foreground" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <ListVideo className="w-4 h-4" /> <span className="hidden sm:inline">Episodes</span>
          </button>

          <div className="flex bg-white/10 rounded-lg p-1 ml-2">
            <button 
              onClick={() => setServer(1)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center", 
                server === 1 ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <Server className="w-3 h-3 mr-1" /> S1
            </button>
            <button 
              onClick={() => setServer(2)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center", 
                server === 2 ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <Server className="w-3 h-3 mr-1" /> S2
            </button>
          </div>
        </div>
      </div>

      {/* Episode Drawer Sidebar */}
      <div className={cn(
        "absolute top-0 right-0 h-full w-80 max-w-full bg-black/95 backdrop-blur-xl border-l border-white/10 z-30 flex flex-col transition-transform duration-300",
        showEpisodes ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50">
          <h3 className="font-bold text-lg">Season {season}</h3>
          <button onClick={() => setShowEpisodes(false)} className="text-white/50 hover:text-white">
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {episodes.map((ep: any) => {
            const isCurrent = ep.episode_number.toString() === episode;
            return (
              <button
                key={ep.id}
                onClick={() => {
                  setLocation(`/player/tv/${id}/${season}/${ep.episode_number}`);
                  setShowEpisodes(false);
                }}
                className={cn(
                  "w-full text-left flex gap-3 p-2 rounded-lg transition-colors group relative overflow-hidden",
                  isCurrent ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="w-24 aspect-video bg-white/5 rounded overflow-hidden shrink-0 relative">
                  {ep.still_path ? (
                    <img src={`https://image.tmdb.org/t/p/w200${ep.still_path}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><MonitorPlay className="w-5 h-5 opacity-20" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] font-bold">E{ep.episode_number}</div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className={cn("text-xs font-bold line-clamp-2", isCurrent ? "text-primary" : "text-white group-hover:text-primary")}>
                    {ep.name}
                  </h4>
                  {isCurrent && <span className="text-[10px] text-primary mt-1 uppercase tracking-wider font-bold">Playing</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlay to close drawer */}
      {showEpisodes && (
        <div 
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setShowEpisodes(false)}
        />
      )}

      {/* Player Frame */}
      <div className="flex-1 w-full relative z-0">
        <iframe
          src={getServerUrl(server)}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title="Video Player"
        />
        <div className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none" />
      </div>

    </div>
  );
}
