import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Destination } from '@/lib/api';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard = ({ destination }: DestinationCardProps) => {
  const defaultImage = 'https://images.unsplash.com/photo-1619467416348-6a782839e95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';

  return (
    <Link to={`/destinations/${destination.id}`}>
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={destination.cover_image || defaultImage}
              alt={destination.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Rating Badge */}
            <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {destination.rating.toFixed(1)}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {destination.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{destination.city}, {destination.country}</span>
            </div>
            {destination.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {destination.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
