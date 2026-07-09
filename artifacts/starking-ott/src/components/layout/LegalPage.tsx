import { AppLayout } from "@/components/layout/AppLayout";
import { useSeo } from "@/hooks/use-seo";

export default function LegalPage({ title, children }: { title: string, children: React.ReactNode }) {
  useSeo({ title });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-24 md:py-32 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">{title}</h1>
        <div className="prose prose-invert prose-amber max-w-none text-white/80 prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary/80">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}
