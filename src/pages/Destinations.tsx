import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { Input } from '@/components/ui/input';
import { destinationsApi, type Destination } from '@/lib/api';

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationsApi.list();
        setDestinations(data);
        setFilteredDestinations(data);
      } catch (err) {
        setError('Failed to load destinations. Please try again later.');
        // Fallback demo data
        const demoDestinations: Destination[] = [
          {
            id: '1',
            title: 'Swiss Alps Adventure',
            description: 'Experience the breathtaking beauty of the Swiss Alps with skiing, hiking, and stunning views.',
            country: 'Switzerland',
            city: 'Zermatt',
            cover_image: 'https://images.unsplash.com/photo-1595885914073-3af381bbee7e?w=800',
            rating: 4.9,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Tropical Paradise',
            description: 'Relax on pristine beaches with crystal clear waters and lush tropical landscapes.',
            country: 'Maldives',
            city: 'Male',
            cover_image: 'https://images.unsplash.com/photo-1714412192114-61dca8f15f68?w=800',
            rating: 4.8,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Ancient Wonders',
            description: 'Explore ancient temples, rich history, and vibrant culture in the heart of Asia.',
            country: 'Japan',
            city: 'Kyoto',
            cover_image: 'https://images.unsplash.com/photo-1619467416348-6a782839e95f?w=800',
            rating: 4.7,
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            title: 'Northern Lights',
            description: 'Witness the magical aurora borealis in the Arctic wilderness.',
            country: 'Norway',
            city: 'Tromsø',
            cover_image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800',
            rating: 4.9,
            created_at: new Date().toISOString(),
          },
        ];
        setDestinations(demoDestinations);
        setFilteredDestinations(demoDestinations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    const filtered = destinations.filter(
      (d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [searchQuery, destinations]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Discover amazing places around the world
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white border-0 text-foreground"
            />
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error && destinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No destinations found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Destinations;
