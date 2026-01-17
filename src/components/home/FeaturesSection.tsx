import { Compass, Star, Shield, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Compass,
    title: 'Discover Destinations',
    description: 'Explore curated destinations from around the world',
  },
  {
    icon: Star,
    title: 'Premium Experience',
    description: 'Luxury travel experiences tailored to your preferences',
  },
  {
    icon: Shield,
    title: 'Trusted & Secure',
    description: 'Book with confidence with our secure platform',
  },
  {
    icon: Heart,
    title: 'Save Favorites',
    description: 'Build your dream trip wishlist',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">TravelX?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience travel planning reimagined with our premium platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
