import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/context/ThemeContext';

import Home from '@/pages/Home';
import Movies from '@/pages/Movies';
import TvShows from '@/pages/TvShows';
import Anime from '@/pages/Anime';
import Search from '@/pages/Search';
import Watch from '@/pages/Watch';
import Person from '@/pages/Person';
import Collection from '@/pages/Collection';
import Platforms from '@/pages/platforms/Platforms';
import PlatformDiscover from '@/pages/platforms/PlatformDiscover';
import MoviePlayer from '@/pages/player/MoviePlayer';
import TvPlayer from '@/pages/player/TvPlayer';
import BlogList from '@/pages/blog/BlogList';
import BlogPost from '@/pages/blog/BlogPost';
import { Privacy, Terms, DMCA, Contact } from '@/pages/Legal';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes cache for TMDB data
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movies" component={Movies} />
      <Route path="/tv" component={TvShows} />
      <Route path="/anime" component={Anime} />
      <Route path="/search" component={Search} />
      
      {/* Platforms */}
      <Route path="/platforms" component={Platforms} />
      <Route path="/platforms/:id" component={PlatformDiscover} />

      {/* Blog */}
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogPost} />

      {/* Dedicated Players */}
      <Route path="/player/movie/:id" component={MoviePlayer} />
      <Route path="/player/tv/:id/:season/:episode" component={TvPlayer} />

      {/* Dynamic Routes */}
      <Route path="/watch/movie/:id" component={Watch} />
      <Route path="/watch/tv/:id/:season?/:episode?" component={Watch} />
      <Route path="/person/:id" component={Person} />
      <Route path="/collection/:id" component={Collection} />
      
      {/* Legal Pages */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/dmca" component={DMCA} />
      <Route path="/contact" component={Contact} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
