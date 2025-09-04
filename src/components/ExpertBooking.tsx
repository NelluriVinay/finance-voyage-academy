import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, User } from "lucide-react";

interface Expert {
  id: string;
  user_id: string;
  hourly_rate_inr: number;
  experience_years: number;
  rating: number;
  bio: string;
  specialization: string[] | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface Booking {
  id: string;
  expert_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  amount_inr: number;
  notes: string;
  experts: {
    profiles: {
      full_name: string | null;
    } | null;
  } | null;
}

const ExpertBooking = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExperts();
    fetchUserBookings();
  }, []);

  const fetchExperts = async () => {
    const { data, error } = await supabase
      .from('experts')
      .select(`
        *,
        profiles(full_name)
      `)
      .eq('is_active', true)
      .eq('is_verified', true);

    if (error) {
      toast({ 
        title: "Error", 
        description: "Failed to load experts", 
        variant: "destructive" 
      });
    } else {
      setExperts((data as unknown as Expert[]) || []);
    }
  };

  const fetchUserBookings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        experts(
          profiles(full_name)
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings((data as unknown as Booking[]) || []);
    }
  };

  const handleBooking = async () => {
    if (!selectedExpert || !bookingDate || !bookingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to book a session",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const scheduledAt = new Date(`${bookingDate}T${bookingTime}`);
    const durationMinutes = parseInt(duration);
    const amountInr = Math.round((selectedExpert.hourly_rate_inr * durationMinutes) / 60);

    const { error } = await supabase
      .from('bookings')
      .insert({
        user_id: session.user.id,
        expert_id: selectedExpert.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
        amount_inr: amountInr,
        notes,
        status: 'pending'
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Booking Created",
        description: "Your expert session has been booked successfully!"
      });
      setSelectedExpert(null);
      setBookingDate("");
      setBookingTime("");
      setNotes("");
      fetchUserBookings();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Experts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Available Finance Experts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {experts.map((expert) => (
              <Card key={expert.id} className="border-muted">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{expert.profiles?.full_name || 'Expert'}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{expert.bio}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{expert.experience_years} years exp</span>
                      <span>₹{expert.hourly_rate_inr}/hour</span>
                      <span>⭐ {expert.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    {expert.specialization && expert.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {expert.specialization.map((spec, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setSelectedExpert(expert)}
                        >
                          Book Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Book Session with {expert.profiles?.full_name || 'Expert'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Select value={duration} onValueChange={setDuration}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="90">90 minutes</SelectItem>
                                <SelectItem value="120">120 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Describe what you'd like to discuss..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>
                          {selectedExpert && bookingDate && bookingTime && (
                            <div className="p-3 bg-accent/10 rounded-lg">
                              <p className="text-sm">
                                <strong>Total Cost:</strong> ₹{Math.round((selectedExpert.hourly_rate_inr * parseInt(duration)) / 60)}
                              </p>
                            </div>
                          )}
                          <Button 
                            onClick={handleBooking} 
                            disabled={loading || !bookingDate || !bookingTime}
                            className="w-full"
                          >
                            {loading ? "Booking..." : "Confirm Booking"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {experts.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No verified experts available at the moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* My Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Expert Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{booking.experts?.profiles?.full_name || 'Expert'}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(booking.scheduled_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.duration_minutes} min
                    </span>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-muted-foreground">{booking.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </p>
                  <p className="text-sm text-muted-foreground">₹{booking.amount_inr}</p>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No expert sessions booked yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertBooking;