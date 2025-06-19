import { useState, useEffect } from "react";
import * as reportService from "@/lib/services/report";
import type { TechnicianResponse } from "@/lib/types/technician";
import type { TechnicianReport } from "@/lib/types/report";
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  Star, 
  Users, 
  Wrench,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Award
} from "lucide-react";

interface TechnicianProps {
    technician: TechnicianResponse
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

const StatCard = ({ title, value, subtitle, icon, trend, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
  };

  const trendIcon = trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-500" /> : 
                   trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" /> : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trendIcon}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default function AnalyticsView({technician}: TechnicianProps) {
    const [report, setReport] = useState<TechnicianReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);
                const reportData: TechnicianReport = await reportService.readTechnicianReport(technician.id);
                setReport(reportData);
            } catch (error) {
                setError('Failed to load analytics data');
                console.error('Error fetching report:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchReport();
    }, [technician.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full p-8 min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="flex flex-col items-center justify-center w-full p-8 min-h-96">
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Analytics</h3>
                <p className="text-gray-600">{error || 'No data available'}</p>
            </div>
        );
    }

    const bookingAcceptanceRate = report.total_bookings > 0 
        ? ((report.accepted_bookings / report.total_bookings) * 100).toFixed(1)
        : '0';

    const averageDistance = report.total_bookings > 0 
        ? (report.total_distance_km / report.total_bookings).toFixed(1)
        : '0';

    const repeatClientRate = report.total_bookings > 0
        ? ((report.num_repeating_clients / report.total_bookings) * 100).toFixed(1)
        : '0';

    return (
        <div className="w-full p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Performance overview</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Bookings"
                    value={report.total_bookings}
                    subtitle={`${report.active_bookings} currently active`}
                    icon={<Calendar className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${report.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    subtitle={`From ${report.total_payments} payments`}
                    icon={<DollarSign className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Average Rating"
                    value={report.rating.toFixed(1)}
                    subtitle={`Based on ${report.num_reviews} reviews`}
                    icon={<Star className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Services Offered"
                    value={report.num_services_offered}
                    subtitle="Active service categories"
                    icon={<Wrench className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Booking Performance */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-600" />
                        Booking Performance
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                <span className="font-medium text-gray-900">Accepted</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">{report.accepted_bookings}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center">
                                <XCircle className="w-5 h-5 text-red-600 mr-3" />
                                <span className="font-medium text-gray-900">Rejected</span>
                            </div>
                            <span className="text-lg font-bold text-red-600">{report.rejected_bookings}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                                <span className="font-medium text-gray-900">Active</span>
                            </div>
                            <span className="text-lg font-bold text-yellow-600">{report.active_bookings}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Acceptance Rate</span>
                                <span className="text-lg font-bold text-blue-600">{bookingAcceptanceRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distance & Travel */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                        Distance & Travel
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-4 bg-indigo-50 rounded-lg">
                            <p className="text-2xl font-bold text-indigo-600">{report.shortest_distance_km.toFixed(1)}</p>
                            <p className="text-sm text-gray-600">Shortest (km)</p>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 rounded-lg">
                            <p className="text-2xl font-bold text-indigo-600">{report.longest_distance_km.toFixed(1)}</p>
                            <p className="text-sm text-gray-600">Longest (km)</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Distance</span>
                            <span className="font-semibold">{report.total_distance_km.toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Average per Job</span>
                            <span className="font-semibold">{averageDistance} km</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client & Service Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client Insights */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-green-600" />
                        Client Insights
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">Repeat Clients</span>
                                <span className="text-2xl font-bold text-green-600">{report.num_repeating_clients}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{repeatClientRate}% of total bookings</p>
                        </div>
                        <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                            <Award className="w-8 h-8 text-yellow-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">Customer Satisfaction</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-4 h-4 ${i < Math.floor(report.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        {report.rating.toFixed(1)}/5.0
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Performance */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <Wrench className="w-5 h-5 mr-2 text-purple-600" />
                        Service Performance
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">Most Popular Service</span>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-lg font-semibold text-purple-600">
                                {report.most_booked_service_name || 'No bookings yet'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">Least Popular Service</span>
                                <TrendingDown className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="text-lg font-semibold text-gray-600">
                                {report.least_booked_service_name || 'No bookings yet'}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Services</span>
                                <span className="text-2xl font-bold text-purple-600">{report.num_services_offered}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}