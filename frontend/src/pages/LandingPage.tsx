import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Calendar, CheckCircle, Zap, Shield, Star } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="flex items-center justify-between p-6 w-full backdrop-blur-sm bg-white/80 border-b border-white/20 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                        JobConnect
                    </h2>
                </div>
                <nav className="flex items-center justify-center gap-6">
                    <button
                        onClick={() => scrollToSection('how-it-works')}
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                    >
                        How It Works
                    </button>
                    <button
                        onClick={() => scrollToSection('features')}
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                    >
                        Features
                    </button>
                    <Button
                        className="cursor-pointer hover: transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => navigate("/login")}
                        variant="outline"
                    >
                        Login
                    </Button>
                </nav>
            </header>

            <main className="flex flex-col items-center justify-start">
                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center gap-8 min-h-[80vh] px-6 text-center relative overflow-hidden py-10">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                                <Star className="w-4 h-4" />
                                Connecting Talent with Opportunity
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent mb-6">
                            JobConnect
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Bridge the gap between skilled professionals and those who need their expertise. 
                            <span className="block mt-2 text-lg text-gray-500">Fast, reliable, and trusted connections.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
                            <Button
                                variant="outline"
                                className="group bg-white text-blue-600 transition-all duration-300 min-w-[200px] h-12 text-lg shadow-lg hover:shadow-xl"
                                onClick={() => navigate("/find-technicians")}
                            >
                                <Users className="w-5 h-5 mr-2" />
                                Find Technicians
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="default"
                                className="group bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 transition-all duration-300 min-w-[200px] h-12 text-lg shadow-lg hover:shadow-xl"
                                onClick={() => navigate("/become-technician")}
                            >
                                <Zap className="w-5 h-5 mr-2" />
                                Become a Technician
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 text-center">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                <div className="text-2xl font-bold text-blue-600">1000+</div>
                                <div className="text-sm text-gray-600">Active Technicians</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                <div className="text-2xl font-bold text-green-600">24/7</div>
                                <div className="text-sm text-gray-600">Support Available</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                <div className="text-2xl font-bold text-purple-600">98%</div>
                                <div className="text-sm text-gray-600">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section
                    className="flex flex-col items-center justify-center gap-12 py-20 px-6 bg-white w-full relative"
                    id="how-it-works"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Getting connected with the right technician has never been easier
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
                        <div className="flex-1 group">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-4">01</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Technicians</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Browse through our network of verified professionals in your area. 
                                    Filter by skills, ratings, and availability to find the perfect match.
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 group">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-4">02</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Book Appointment</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Schedule your service at a time that works for you. 
                                    Get instant confirmation and direct communication with your technician.
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 group">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-4">03</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Job Done</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Enjoy professional service with guaranteed quality. 
                                    Rate your experience and help build our trusted community.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    className="flex flex-col items-center justify-center gap-12 py-20 px-6 bg-gradient-to-r from-gray-50 to-blue-50 w-full"
                    id="features"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose JobConnect?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We're committed to making professional connections seamless and secure
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <Shield className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Professionals</h3>
                            <p className="text-gray-600">All technicians undergo thorough background checks and skill verification.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <Zap className="w-12 h-12 text-green-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Matching</h3>
                            <p className="text-gray-600">Advanced algorithms connect you with the right professional in minutes.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <Star className="w-12 h-12 text-yellow-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
                            <p className="text-gray-600">100% satisfaction guarantee with our professional service standards.</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="flex flex-col items-center justify-center gap-8 py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 w-full text-white text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                        Join thousands of satisfied customers and professionals who trust JobConnect
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            className="bg-white text-blue-600 border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 min-w-[200px] h-12 text-lg"
                            onClick={() => navigate("/find-technicians")}
                        >
                            Start Your Search
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 min-w-[200px] h-12 text-lg"
                            onClick={() => navigate("/become-technician")}
                        >
                            Join as Technician
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">JobConnect</h3>
                    </div>
                    <p className="text-gray-400">Connecting talent with opportunity, one job at a time.</p>
                </div>
            </footer>
        </div>
    );
}