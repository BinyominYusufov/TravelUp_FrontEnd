import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { BookingCard } from '@/components/bookings/BookingCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi, type Booking } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      try {
        const data = await bookingsApi.getMyBookings();
        setBookings(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load bookings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading, toast]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      const updatedBooking = await bookingsApi.cancel(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? updatedBooking : b))
      );
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been cancelled successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-4">
          <Calendar className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Sign in to view your bookings</h1>
          <p className="text-muted-foreground text-center max-w-md">
            You need to be signed in to view and manage your travel bookings.
          </p>
          <div className="flex gap-3 mt-4">
            <Button asChild variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="gradient-primary border-0">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your travel reservations</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
              <p className="text-muted-foreground mb-6">
                Start planning your next adventure!
              </p>
              <Button asChild className="gradient-primary border-0">
                <Link to="/destinations">Explore Destinations</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                  isLoading={cancellingId === booking.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Bookings;
