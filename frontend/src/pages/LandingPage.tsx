import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen">
            <header className="flex items-center justify-between p-4 w-full">
                <h2 className="text-2xl font-bold">JobConnect</h2>
                <nav className="flex items-center justify-center gap-4">
                    <button 
                        onClick={() => scrollToSection('how-it-works')}
                        className="hover:underline cursor-pointer"
                    >
                        How It Works
                    </button>
                    <Button 
                        className="cursor-pointer" 
                        onClick={() => navigate("/login")} 
                        variant="outline"
                    >
                        Login
                    </Button>
                </nav>
            </header>
            
            <main className="flex flex-col items-center justify-start">
                {/* Hero section */}
                <section className="flex flex-col items-center justify-center gap-6 min-h-[70vh] px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">JobConnect</h1>
                    <p className="text-lg text-gray-600 max-w-md">
                        Bridge the gap between job seekers and employers
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <Button 
                            variant="outline" 
                            className="cursor-pointer min-w-[160px]"
                            onClick={() => navigate("/find-technicians")}
                        >
                            Find Technicians
                        </Button>
                        <Button 
                            variant="default" 
                            className="cursor-pointer min-w-[160px]"
                            onClick={() => navigate("/become-technician")}
                        >
                            Become a Technician
                        </Button>
                    </div>
                </section>

                {/* How it works section */}
                <section 
                    className="flex flex-col items-center justify-center gap-6 py-16 px-4 bg-gray-50 w-full" 
                    id="how-it-works"
                >
                    <h2 className="text-3xl font-bold text-center">How It Works</h2>
                    <div className="flex flex-col md:flex-row gap-8 max-w-4xl">
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                            <p className="text-lg">Find technicians near you</p>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                            <p className="text-lg">Book an appointment</p>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                            <p className="text-lg">Get your job done</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
