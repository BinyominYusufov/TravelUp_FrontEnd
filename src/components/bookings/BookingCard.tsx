import { format } from 'date-fns';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Booking } from '@/lib/api';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const BookingCard = ({ booking, onCancel, isLoading }: BookingCardProps) => {
  // Ensure booking.id is converted to string
  const bookingId = String(booking.id);
  const displayId = bookingId.length > 8 ? bookingId.slice(0, 8) : bookingId;
  
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Booking #{displayId}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Created {format(new Date(booking.created_at), 'MMM d, yyyy')}
          </p>
        </div>
        <Badge className={statusColors[booking.status]} variant="outline">
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {format(new Date(booking.start_date), 'MMM d')} - {format(new Date(booking.end_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{booking.travelers_count} travelers</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold">${booking.total_price.toFixed(2)}</span>
          </div>
          
          {booking.status === 'pending' && onCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(bookingId)}
              disabled={isLoading}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
