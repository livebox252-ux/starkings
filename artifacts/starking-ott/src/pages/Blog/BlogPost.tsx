import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSeo } from "@/hooks/use-seo";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { blogPosts } from "./blog-data";
import NotFound from "@/pages/not-found";

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  useSeo({
    title: post ? post.title : "Blog Post Not Found",
    description: post?.excerpt,
    type: "website",
  });

  if (!post) {
    return <NotFound />;
  }

  return (
    <AppLayout>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "image": post.image,
          "datePublished": post.date,
          "description": post.excerpt,
        })}
      </script>

      <div className="relative pt-24 pb-32 flex items-center justify-center min-h-[50vh] bg-black">
        <div className="absolute inset-0">
          <img src={post.image} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <Link href="/blog" className="inline-flex items-center text-primary/80 hover:text-primary mb-6 text-sm font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl -mt-16 relative z-20">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-2xl border border-border prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </AppLayout>
  );
}
