import * as reviewService from "@/lib/services/review";
import * as clientService from "@/lib/services/client";
import * as bookingService from "@/lib/services/booking";
import * as notificationService from "@/lib/services/notification";
import type { TechnicianResponse } from "@/lib/types/technician";
import type { BookingCreate, BookingResponse } from "@/lib/types/booking";
import { useEffect, useState } from "react";
import type { ReviewResponse } from "@/lib/types/review";
import { toast } from "sonner";
import type { ClientResponse } from "@/lib/types/client";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Lucide icons
import { 
    Heart, 
    Calendar, 
    Mail, 
    Phone, 
    MapPin, 
    Star, 
    StarIcon,
    CheckCircle, 
    Clock,
    X,
    User
} from "lucide-react";

export function TechnicianProfilePage({technician, client}: {technician: TechnicianResponse, client: ClientResponse}) {
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingData, setBookingData] = useState<Partial<BookingCreate>>({
        client_id: client.id,
        technician_id: technician.id,
        location: {
            location_name: '',
            latitude: 0,
            longitude: 0
        },
        service_name: '',
        description: '',
        timeslot: {
            slot_date: '',
            start_time: '',
            end_time: ''
        }
    });

    const bookSendBookingRequest = async () => {
        if (!bookingData.service_name || !bookingData.description || !bookingData.location?.location_name || 
            !bookingData.timeslot?.slot_date || !bookingData.timeslot?.start_time || !bookingData.timeslot?.end_time) {
            toast.error("Please fill in all required fields");
            return;
        }

        const completeBookingData: BookingCreate = {
            client_id: client.id,
            technician_id: technician.id,
            location: bookingData.location!,
            service_name: bookingData.service_name,
            description: bookingData.description,
            timeslot: bookingData.timeslot!
        };

        setIsLoading(true);
        try {
            const response: BookingResponse = await bookingService.createBooking(completeBookingData);
            toast.success(`A booking request has been sent to ${technician.fullname}`);
            await notificationService.createNotification({
                technician_id: technician.id,
                client_id: client.id,
                title: "Booking Request",
                message: `You have a new booking request from ${client.fullname} for ${completeBookingData.service_name}`,
            });
            setShowBookingModal(false);
            // Reset form
            setBookingData({
                client_id: client.id,
                technician_id: technician.id,
                location: { location_name: '', latitude: 0, longitude: 0 },
                service_name: '',
                description: '',
                timeslot: { slot_date: '', start_time: '', end_time: '' }
            });
        } catch (error) {
            toast.error("Failed to send booking request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const addTechnicianToFavorites = async () => {
        setIsLoading(true);
        try {
            const added: boolean = await clientService.addFavoriteTechnician(client.id, technician.id);
            if (added) {
                toast.success(`${technician.fullname} has been added to favorites`);
            } else {
                toast.info(`${technician.fullname} is already in your favorites`);
            }
        } catch (error) {
            toast.error("Failed to add to favorites. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const renderTechnicianDetails = () => (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{technician.fullname}</h1>
                        <div className="flex items-center mt-2 gap-4">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-gray-600">{technician.rating.toFixed(1)}</span>
                            </div>
                            <Badge variant={technician.is_available ? "default" : "destructive"}>
                                <Clock className="w-3 h-3 mr-1" />
                                {technician.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                            {technician.is_verified && (
                                <Badge variant="secondary">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={addTechnicianToFavorites}
                            disabled={isLoading}
                        >
                            <Heart className="w-4 h-4 mr-2" />
                            Add to Favorites
                        </Button>
                        <Button
                            onClick={() => setShowBookingModal(true)}
                            disabled={!technician.is_available || isLoading}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Now
                        </Button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                {technician.email}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                {technician.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {technician.location.location_name}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
                        <div className="flex flex-wrap gap-2">
                            {technician.services.map((service, index) => (
                                <Badge key={index} variant="outline">
                                    {service}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderReviews = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Reviews ({reviews.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <h4 className="font-semibold text-gray-900">{review.client_name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="outline">
                                        {review.service_name}
                                    </Badge>
                                </div>
                                {review.comment && (
                                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mt-3">
                                        "{review.comment}"
                                    </blockquote>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderBookingModal = () => (
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Book {technician.fullname}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={(e) => { e.preventDefault(); bookSendBookingRequest(); }} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="service">Service</Label>
                        <Select
                            value={bookingData.service_name}
                            onValueChange={(value) => setBookingData({...bookingData, service_name: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                                {technician.services.map((service) => (
                                    <SelectItem key={service} value={service}>
                                        {service}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            type="text"
                            value={bookingData.location?.location_name || ''}
                            onChange={(e) => setBookingData({
                                ...bookingData, 
                                location: {...bookingData.location!, location_name: e.target.value}
                            })}
                            placeholder="Enter location"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={bookingData.description}
                            onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                            rows={3}
                            placeholder="Describe your service needs"
                            required
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={bookingData.timeslot?.slot_date || ''}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    timeslot: {...bookingData.timeslot!, slot_date: e.target.value}
                                })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={bookingData.timeslot?.start_time || ''}
                                    onChange={(e) => setBookingData({
                                        ...bookingData,
                                        timeslot: {...bookingData.timeslot!, start_time: e.target.value}
                                    })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={bookingData.timeslot?.end_time || ''}
                                    onChange={(e) => setBookingData({
                                        ...bookingData,
                                        timeslot: {...bookingData.timeslot!, end_time: e.target.value}
                                    })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowBookingModal(false)}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Request'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewData = await reviewService.readallReviews(undefined, technician.id);
                setReviews(reviewData);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                toast.error('Failed to load reviews');
            }
        };
        
        fetchReviews();
    }, [technician.id]);

    return (
        <div className="container mx-auto px-4 py-6">
            {renderTechnicianDetails()}
            {renderReviews()}
            {renderBookingModal()}
        </div>
    );
}