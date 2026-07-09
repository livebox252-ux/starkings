import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSeo } from "@/hooks/use-seo";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { blogPosts } from "./blog-data";

export default function BlogList() {
  useSeo({
    title: "Streaming Guide & Entertainment Blog",
    description: "Read our latest articles on movies, TV shows, and anime. Discover what to watch next with Star King OTT.",
  });

  return (
    <AppLayout>
      <div className="pt-24 pb-12 bg-black/50 border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">Entertainment Blog</h1>
          <p className="text-lg text-muted-foreground">Discover guides, recommendations, and deep dives into the world of movies, TV series, and anime.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-foreground">{post.title}</h2>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center text-primary text-sm font-bold mt-auto group-hover:translate-x-1 transition-transform w-max">
                  Read Article <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
