import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-2xl">
              <Compass className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white text-balance leading-tight">
            Explore the World<br />
            <span className="opacity-90">Your Way</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto text-balance">
            Discover breathtaking destinations, plan unforgettable trips, and book premium experiences with TravelX.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-6 text-lg font-semibold"
              asChild
            >
              <Link to="/destinations">
                Explore Destinations
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold bg-transparent"
              asChild
            >
              <Link to="/register">Plan a Trip</Link>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-16 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
};
