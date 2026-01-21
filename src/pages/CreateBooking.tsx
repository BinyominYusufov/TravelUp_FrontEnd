import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Calendar, Users, Minus, Plus, Check, Shield, Clock, Tag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDestinationById } from '@/hooks/useDestinationById';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const CreateBooking = () => {
  const { id } = useParams<{ id: string }>();
  const { data: destination, isLoading: isLoadingDestination, error } = useDestinationById(id || '');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    travel_date: '',
    travelers_count: 2,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Price calculation
  const pricePerPerson = 899; // Base price per person
  const serviceFeePercentage = 0.1; // 10% service fee
  const subtotal = pricePerPerson * bookingData.travelers_count;
  const serviceFee = Math.round(subtotal * serviceFeePercentage);
  const total = subtotal + serviceFee;

  const handleTravelersChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(20, bookingData.travelers_count + delta));
    setBookingData({ ...bookingData, travelers_count: newCount });
  };

  const handleConfirmBooking = async () => {
    setErrorMessage(null);

    if (!bookingData.travel_date) {
      setErrorMessage('Please select a travel date');
      return;
    }

    if (!id) {
      setErrorMessage('Invalid destination');
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to make a booking.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsCreatingBooking(true);
    try {
      // Calculate dates (assuming travel_date is the start date, adding 5 days for end date)
      const startDate = new Date(bookingData.travel_date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 5); // Default 5-day trip

      await bookingsApi.create({
        destination_id: id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        travelers_count: bookingData.travelers_count,
        total_price: total,
      });

      toast({
        title: 'Booking confirmed!',
        description: 'Your booking has been created successfully.',
      });

      navigate('/bookings');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create booking. Please try again.'
      );
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (authLoading || isLoadingDestination) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !destination) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="text-destructive text-lg font-semibold">
              Failed to load destination
            </div>
            <p className="text-muted-foreground">
              {error?.message || 'The destination you\'re looking for doesn\'t exist.'}
            </p>
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
          <Link to={`/destinations/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destination
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Destination Card */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  <img
                    src={destination.cover_image || defaultImage}
                    alt={destination.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-2xl font-bold mb-1">{destination.title}</h2>
                    <p className="text-sm opacity-90">{destination.country}</p>
                    <Badge className="mt-2 bg-blue-500/80 hover:bg-blue-500/90">
                      Cities
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Date Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <CardTitle>Travel Date</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">When do you want to travel?</p>
                <div className="space-y-2">
                  <Label htmlFor="travel_date">Select Date</Label>
                  <Input
                    id="travel_date"
                    type="date"
                    value={bookingData.travel_date}
                    onChange={(e) => {
                      setBookingData({ ...bookingData, travel_date: e.target.value });
                      setErrorMessage(null);
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Number of Travelers Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <CardTitle>Number of Travelers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">How many people are traveling?</p>
                <div className="flex items-center justify-center gap-6 py-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => handleTravelersChange(-1)}
                    disabled={bookingData.travelers_count <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {bookingData.travelers_count}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Travelers</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => handleTravelersChange(1)}
                    disabled={bookingData.travelers_count >= 20}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per person</span>
                    <span className="font-medium">${pricePerPerson}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Travelers</span>
                    <span className="font-medium">x{bookingData.travelers_count}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="font-medium">${serviceFee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">${total}</span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  disabled={isCreatingBooking || !bookingData.travel_date}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isCreatingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                {errorMessage && (
                  <p className="text-sm text-destructive text-center">{errorMessage}</p>
                )}

                <p className="text-xs text-center text-muted-foreground pt-4 border-t">
                  By booking, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Assurances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">256-bit SSL</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Free Cancellation</h3>
              <p className="text-sm text-muted-foreground">Up to 24h</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Tag className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Best Price</h3>
              <p className="text-sm text-muted-foreground">Guaranteed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateBooking;
