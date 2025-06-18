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
    CheckCircle, 
    Clock,
    User,
    Award,
    MessageSquare,
    Briefcase,
    Loader2,
    Quote,
    ChevronLeft,
    Send
} from "lucide-react";

export function TechnicianProfilePage({technician, client}: {technician: TechnicianResponse, client: ClientResponse}) {
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFavoriting, setIsFavoriting] = useState(false);
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
        setIsFavoriting(true);
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
            setIsFavoriting(false);
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 transition-colors ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return technician.rating;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating as keyof typeof distribution]++;
        });
        return distribution;
    };

    const renderTechnicianHeader = () => {
        const avgRating = getAverageRating();
        
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl mb-8">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative p-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold mb-3">{technician.fullname}</h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{avgRating.toFixed(1)}</span>
                                        <span className="text-white/80">({reviews.length} reviews)</span>
                                    </div>
                                    <Badge 
                                        variant={technician.is_available ? "default" : "destructive"}
                                        className={`${technician.is_available ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                    >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {technician.is_available ? 'Available Now' : 'Currently Unavailable'}
                                    </Badge>
                                    {technician.is_verified && (
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Verified Professional
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-6 text-white/90">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{technician.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{technician.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{technician.location.location_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={addTechnicianToFavorites}
                                disabled={isFavoriting}
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                {isFavoriting ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <Heart className="w-5 h-5 mr-2" />
                                )}
                                Add to Favorites
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => setShowBookingModal(true)}
                                disabled={!technician.is_available || isLoading}
                                className="bg-white text-blue-700 hover:bg-gray-100 shadow-lg"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Book Appointment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderServicesSection = () => (
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    Professional Services
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {technician.services.map((service, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                            <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                                {service}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const renderRatingStats = () => {
        const distribution = getRatingDistribution();
        const total = reviews.length;
        
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-1 shadow-lg border-0">
                    <CardContent className="p-6 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-10 h-10 text-white fill-current" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{getAverageRating().toFixed(1)}</h3>
                        <div className="flex justify-center mb-2">
                            {renderStars(Math.round(getAverageRating()))}
                        </div>
                        <p className="text-gray-600">Based on {reviews.length} reviews</p>
                    </CardContent>
                </Card>
                
                <Card className="lg:col-span-2 shadow-lg border-0">
                    <CardContent className="p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Rating Distribution</h4>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-12">
                                        <span className="text-sm font-medium">{rating}</span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: total > 0 ? `${(distribution[rating as keyof typeof distribution] / total) * 100}%` : '0%' }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500 w-8 text-right">
                                        {distribution[rating as keyof typeof distribution]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderReviews = () => (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    Customer Reviews ({reviews.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                        <p className="text-gray-500">Be the first to leave a review for this technician!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <div 
                                key={review.id} 
                                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {review.client_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">{review.client_name}</h4>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {review.service_name}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                {review.comment && (
                                    <div className="relative">
                                        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-200" />
                                        <blockquote className="pl-6 text-gray-700 italic leading-relaxed">
                                            "{review.comment}"
                                        </blockquote>
                                    </div>
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        Book {technician.fullname}
                    </DialogTitle>
                    <p className="text-gray-600">Fill out the details below to send a booking request</p>
                </DialogHeader>
                
                <form onSubmit={(e) => { e.preventDefault(); bookSendBookingRequest(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="service" className="text-sm font-semibold text-gray-700">Service *</Label>
                            <Select
                                value={bookingData.service_name}
                                onValueChange={(value) => setBookingData({...bookingData, service_name: value})}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {technician.services.map((service) => (
                                        <SelectItem key={service} value={service}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                {service}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location *</Label>
                            <Input
                                id="location"
                                type="text"
                                className="h-12"
                                value={bookingData.location?.location_name || ''}
                                onChange={(e) => setBookingData({
                                    ...bookingData, 
                                    location: {...bookingData.location!, location_name: e.target.value}
                                })}
                                placeholder="Enter your location"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Service Description *</Label>
                        <Textarea
                            id="description"
                            value={bookingData.description}
                            onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                            rows={4}
                            className="resize-none"
                            placeholder="Describe what you need help with..."
                            required
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Preferred Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                className="h-12"
                                value={bookingData.timeslot?.slot_date || ''}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    timeslot: {...bookingData.timeslot!, slot_date: e.target.value}
                                })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime" className="text-sm font-semibold text-gray-700">Start Time *</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    className="h-12"
                                    value={bookingData.timeslot?.start_time || ''}
                                    onChange={(e) => setBookingData({
                                        ...bookingData,
                                        timeslot: {...bookingData.timeslot!, start_time: e.target.value}
                                    })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime" className="text-sm font-semibold text-gray-700">End Time *</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    className="h-12"
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
                    
                    <div className="flex gap-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowBookingModal(false)}
                            className="flex-1 h-12"
                            disabled={isLoading}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending Request...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Booking Request
                                </>
                            )}
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {renderTechnicianHeader()}
                {renderServicesSection()}
                {reviews.length > 0 && renderRatingStats()}
                {renderReviews()}
                {renderBookingModal()}
            </div>
        </div>
    );
}