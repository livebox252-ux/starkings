import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <h1 className="text-8xl font-bold font-serif text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The cinematic experience you're looking for seems to be missing from our reel.
        </p>
        <Link 
          href="/" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-bold transition-colors"
        >
          Return Home
        </Link>
      </div>
    </AppLayout>
  );
}
