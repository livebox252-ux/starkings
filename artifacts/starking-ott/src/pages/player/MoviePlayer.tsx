import { useParams, Link } from "wouter";
import { useGetTmdbDetails } from "@workspace/api-client-react";
import { useSeo } from "@/hooks/use-seo";
import { ArrowLeft, Server, MonitorPlay } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MoviePlayer() {
  const { id } = useParams();
  const [server, setServer] = useState<1 | 2>(1);

  const { data } = useGetTmdbDetails('movie', id as string, {
    query: { enabled: !!id, queryKey: ['details', 'movie', id] }
  });

  const details = data?.details as any;
  const title = details?.title || "Movie";

  useSeo({
    title: `Watching ${title}`,
    description: `Full screen player for ${title}`,
  });

  const getServerUrl = (serverId: number) => {
    return serverId === 1 
      ? `https://vidsrc.sbs/embed/movie/${id}`
      : `https://cinesrc.st/embed/movie/${id}`;
  };

  return (
    <div className="w-[100dvw] h-[100dvh] bg-black text-white flex flex-col overflow-hidden selection:bg-primary/30 selection:text-primary dark theme-gold">
      {/* Title Bar */}
      <div className="h-16 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between px-4 shrink-0 absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 opacity-0 hover:opacity-100 focus-within:opacity-100">
        <div className="flex items-center gap-4">
          <Link href={`/watch/movie/${id}`} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-tight line-clamp-1">{title}</h1>
            <p className="text-xs text-white/50">Movie</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/10 rounded-lg p-1">
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

      {/* Player Frame */}
      <div className="flex-1 w-full relative">
        <iframe
          src={getServerUrl(server)}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title="Video Player"
        />
        
        {/* Hidden hover area to show controls */}
        <div className="absolute top-0 left-0 right-0 h-24 z-0 pointer-events-none" />
      </div>
    </div>
  );
}
