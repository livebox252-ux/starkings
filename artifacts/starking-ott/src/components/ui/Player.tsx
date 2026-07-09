import { useState } from "react";
import { cn } from "@/lib/utils";
import { Server, MonitorPlay, AlertCircle, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PlayerProps {
  tmdbId: string;
  type: 'movie' | 'tv';
  season?: string;
  episode?: string;
}

export function Player({ tmdbId, type, season, episode }: PlayerProps) {
  const [server, setServer] = useState<1 | 2>(1);

  // Server URLs mapping as requested
  const getServerUrl = (serverId: number) => {
    if (type === 'movie') {
      return serverId === 1 
        ? `https://vidsrc.sbs/embed/movie/${tmdbId}`
        : `https://cinesrc.st/embed/movie/${tmdbId}`;
    } else {
      return serverId === 1
        ? `https://vidsrc.sbs/embed/tv/${tmdbId}/${season}/${episode}`
        : `https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}`;
    }
  };

  const fullScreenHref = type === 'movie' 
    ? `/player/movie/${tmdbId}` 
    : `/player/tv/${tmdbId}/${season}/${episode}`;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Player Frame Container */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border/50 group">
        <iframe
          src={getServerUrl(server)}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title="Video Player"
        />
      </div>

      {/* Controls / Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <MonitorPlay className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground/90">
            Currently playing on <strong className="text-foreground">Server {server}</strong>
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground mr-2 hidden md:inline-block">Switch server:</span>
          <Button 
            variant={server === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setServer(1)}
            className={cn("flex-1 sm:flex-none", server === 1 ? "shadow-lg shadow-primary/20" : "bg-transparent border-border/50 hover:bg-white/5 text-foreground")}
          >
            <Server className="w-4 h-4 mr-2" /> S1
          </Button>
          <Button 
            variant={server === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setServer(2)}
            className={cn("flex-1 sm:flex-none", server === 2 ? "shadow-lg shadow-primary/20" : "bg-transparent border-border/50 hover:bg-white/5 text-foreground")}
          >
            <Server className="w-4 h-4 mr-2" /> S2
          </Button>
          
          <Button 
            asChild
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-none ml-0 sm:ml-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          >
            <Link href={fullScreenHref}>
              <Maximize className="w-4 h-4 mr-2" /> Full Screen Player
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 text-foreground/80 p-3 rounded-md border border-primary/10">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <p>Star King OTT does not host any files on our server. We only link to publicly available media hosted by third parties. If a server is slow or not working, try switching to the other one.</p>
      </div>
    </div>
  );
}