import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Star, MapPin, Calendar, Heart, Shield, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDestinationById } from '@/hooks/useDestinationById';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: destination, isLoading, error } = useDestinationById(id || '');
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    travelers_count: 1,
  });

  // Calculate price (base price per person per day)
  const basePricePerDay = 150; // Default price, can be adjusted
  const calculatePrice = () => {
    if (!bookingData.start_date || !bookingData.end_date) return 0;
    const start = new Date(bookingData.start_date);
    const end = new Date(bookingData.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * basePricePerDay * bookingData.travelers_count;
  };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to make a booking.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!id) return;

    if (!bookingData.start_date || !bookingData.end_date) {
      toast({
        title: 'Invalid dates',
        description: 'Please select both start and end dates.',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(bookingData.start_date) >= new Date(bookingData.end_date)) {
      toast({
        title: 'Invalid dates',
        description: 'End date must be after start date.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingBooking(true);
    try {
      const totalPrice = calculatePrice();
      await bookingsApi.create({
        destination_id: id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        travelers_count: bookingData.travelers_count,
        total_price: totalPrice,
      });
      
      toast({
        title: 'Booking created',
        description: 'Your booking has been created successfully!',
      });
      
      setIsBookingDialogOpen(false);
      setBookingData({ start_date: '', end_date: '', travelers_count: 1 });
      navigate('/bookings');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading destination...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="text-destructive text-lg font-semibold">
              Failed to load destination
            </div>
            <p className="text-muted-foreground">{error.message || 'An error occurred while fetching the destination.'}</p>
            <Button asChild variant="outline">
              <Link to="/destinations">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Destinations
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!destination) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="text-lg font-semibold">Destination not found</div>
            <p className="text-muted-foreground">The destination you're looking for doesn't exist.</p>
            <Button asChild variant="outline">
              <Link to="/destinations">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Destinations
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1619467416348-6a782839e95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/destinations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Link>
        </Button>

        {/* Hero Image */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-8">
          <img
            src={destination.cover_image || defaultImage}
            alt={destination.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Rating Badge */}
          <Badge className="absolute top-4 right-4 bg-white/90 text-foreground hover:bg-white text-lg px-4 py-2">
            <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
            {destination.rating.toFixed(1)}
          </Badge>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Title and Location */}
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{destination.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{destination.city}, {destination.country}</span>
                  </div>
                </div>

                {/* Description */}
                {destination.description && (
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">About This Destination</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {destination.description}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Added {new Date(destination.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                    <p className="text-3xl font-bold">${basePricePerDay}</p>
                    <p className="text-sm text-muted-foreground">per person per day</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Free cancellation up to 24 hours</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Best price guarantee</span>
                    </div>
                  </div>

                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Link to={`/destinations/${id}/book`}>
                      Book Now
                    </Link>
                  </Button>
                  
                  <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Quick Book
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Book {destination.title}</DialogTitle>
                        <DialogDescription>
                          Fill in the details to complete your booking
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_date">Start Date</Label>
                          <Input
                            id="start_date"
                            type="date"
                            value={bookingData.start_date}
                            onChange={(e) => setBookingData({ ...bookingData, start_date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_date">End Date</Label>
                          <Input
                            id="end_date"
                            type="date"
                            value={bookingData.end_date}
                            onChange={(e) => setBookingData({ ...bookingData, end_date: e.target.value })}
                            min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="travelers">Number of Travelers</Label>
                          <Input
                            id="travelers"
                            type="number"
                            min="1"
                            max="20"
                            value={bookingData.travelers_count}
                            onChange={(e) => setBookingData({ ...bookingData, travelers_count: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                        {calculatePrice() > 0 && (
                          <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total Price</span>
                              <span className="text-2xl font-bold">${calculatePrice()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsBookingDialogOpen(false)}
                          disabled={isCreatingBooking}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleBookingSubmit}
                          disabled={isCreatingBooking || !bookingData.start_date || !bookingData.end_date}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {isCreatingBooking ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            'Confirm Booking'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    asChild
                  >
                    <Link to={`/destinations/${id}/book`}>
                      Check Availability
                    </Link>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Questions? Contact our travel experts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DestinationDetail;
