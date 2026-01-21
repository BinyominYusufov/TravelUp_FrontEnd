import { Layout } from '@/components/layout/Layout';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Favorites = () => {
  return (
    <Layout>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            Favorites
          </h1>
          <p className="text-muted-foreground">Your saved destinations and trips</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorites</CardTitle>
              <CardDescription>Destinations and trips you've saved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  You haven't saved any favorites yet. Start exploring and add destinations to your favorites!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Favorites;
