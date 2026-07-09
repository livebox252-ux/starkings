import { useParams } from "wouter";
import { useGetTmdbPerson } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MediaCard } from "@/components/ui/MediaCard";
import { useSeo } from "@/hooks/use-seo";

export default function Person() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTmdbPerson(id as string, {
    query: { enabled: !!id, queryKey: ['person', id] }
  });

  const details = data?.details as any;
  const credits = data?.credits as any;

  useSeo({
    title: details?.name || "Person",
    description: details?.biography?.slice(0, 150),
    type: "profile"
  });

  if (isLoading) {
    return <AppLayout><div className="pt-32 text-center">Loading...</div></AppLayout>;
  }

  if (error || !details) {
    return <AppLayout><div className="pt-32 text-center text-red-500">Error loading person details.</div></AppLayout>;
  }

  // Combine and sort credits by popularity
  const knownFor = [...(credits?.cast || []), ...(credits?.crew || [])]
    .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) // dedup
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 24);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="md:col-span-1">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-6">
              {details.profile_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${details.profile_path}`} 
                  alt={details.name}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">No Image</div>
              )}
            </div>
            
            <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-2">Personal Info</h3>
            <dl className="space-y-4 text-sm">
              {details.known_for_department && (
                <div>
                  <dt className="text-muted-foreground">Known For</dt>
                  <dd className="font-medium text-white">{details.known_for_department}</dd>
                </div>
              )}
              {details.gender > 0 && (
                <div>
                  <dt className="text-muted-foreground">Gender</dt>
                  <dd className="font-medium text-white">{details.gender === 1 ? 'Female' : 'Male'}</dd>
                </div>
              )}
              {details.birthday && (
                <div>
                  <dt className="text-muted-foreground">Birthday</dt>
                  <dd className="font-medium text-white">{details.birthday}</dd>
                </div>
              )}
              {details.place_of_birth && (
                <div>
                  <dt className="text-muted-foreground">Place of Birth</dt>
                  <dd className="font-medium text-white">{details.place_of_birth}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="md:col-span-3">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {details.name}
            </h1>
            
            {details.biography && (
              <div className="mb-10">
                <h3 className="font-bold text-xl mb-4">Biography</h3>
                <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {details.biography}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-xl mb-6">Known For</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {knownFor.map((item: any) => (
                  <MediaCard key={item.id} {...item} media_type={item.media_type} />
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
}
