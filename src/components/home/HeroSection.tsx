import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BG_IMAGE =
  'https://images.unsplash.com/photo-1619467416348-6a782839e95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600&q=80';

export const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = BG_IMAGE;
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />

      {/* Purple overlay (как на макете) */}
      <div className="absolute inset-0 bg-purple-600/60" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center px-4 space-y-6">
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white">
          Explore the World
        </h1>

        <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
          Your Way
        </h2>

        <p className="text-white/90 max-w-2xl mx-auto text-lg md:text-xl">
          Discover breathtaking destinations, plan unforgettable trips,
          and book premium experiences with TravelX.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-lg"
            asChild
          >
            <Link to="/destinations">
              Explore Destinations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-lg"
            asChild
          >
            <Link to="/register" className='text-[#3f3f3f]'>Plan a Trip</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
