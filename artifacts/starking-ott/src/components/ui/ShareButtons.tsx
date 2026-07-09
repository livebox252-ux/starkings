import { useState } from "react";
import { Share2, Link as LinkIcon, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  text?: string;
  url?: string;
}

export function ShareButtons({ title, text, url }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = url || window.location.href;
  const shareText = text || `Watch ${title} on Star King OTT`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Copied to clipboard.",
    });
    setIsOpen(false);
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        onClick={handleNativeShare}
        className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white shadow-lg backdrop-blur-md"
      >
        <Share2 className="w-4 h-4 mr-2" /> Share
      </Button>

      {isOpen && !navigator.share && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-1 flex flex-col gap-1">
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              WhatsApp
            </a>
            <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              Telegram
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-[#1DA1F2]">
              <Twitter className="w-4 h-4 mr-2" /> X (Twitter)
            </a>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-[#4267B2]">
              <Facebook className="w-4 h-4 mr-2" /> Facebook
            </a>
            <div className="h-px bg-border my-1" />
            <button onClick={copyLink} className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors w-full text-left">
              <LinkIcon className="w-4 h-4 mr-2" /> Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}