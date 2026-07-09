import { useParams } from "wouter";
import { useGetTmdbCollection } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MediaCard } from "@/components/ui/MediaCard";
import { useSeo } from "@/hooks/use-seo";

export default function Collection() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTmdbCollection(id as string, {
    query: { enabled: !!id, queryKey: ['collection', id] }
  });

  const collection = data as any;

  useSeo({
    title: collection?.name || "Collection",
    description: collection?.overview,
  });

  if (isLoading) {
    return <AppLayout><div className="pt-32 text-center">Loading...</div></AppLayout>;
  }

  if (error || !collection) {
    return <AppLayout><div className="pt-32 text-center text-red-500">Error loading collection.</div></AppLayout>;
  }

  // Sort parts by release date
  const parts = (collection.parts || []).sort((a: any, b: any) => {
    return new Date(a.release_date || 0).getTime() - new Date(b.release_date || 0).getTime();
  });

  return (
    <AppLayout>
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
        {collection.backdrop_path && (
          <img 
            src={`https://image.tmdb.org/t/p/original${collection.backdrop_path}`}
            alt={collection.name}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-12">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 text-shadow">
              {collection.name}
            </h1>
            {collection.overview && (
              <p className="text-lg text-white/80 max-w-3xl text-shadow leading-relaxed">
                {collection.overview}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Movies in this collection ({parts.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {parts.map((part: any) => (
            <MediaCard key={part.id} {...part} media_type="movie" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
