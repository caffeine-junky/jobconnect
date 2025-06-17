import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <>
        <header className="flex items-center justify-between p-4 w-full">
            <h2 className="text-2xl font-bold">JobConnect</h2>
            <nav className="flex items-center justify-center gap-4">
                <Link to={"#how-it-works"}>How It works</Link>
                <Button className="cursor-pointer" onClick={() => navigate("/login")} variant={"outline"}>Login</Button>
            </nav>
        </header>
        <main className="w-screen h-screen flex flex-col items-center justify-start gap-4">
            {/* Hero section */}
            <div className="flex flex-col items-center justify-center gap-4 min-h-100">
                <h1 className="text-4xl font-bold">JobConnect</h1>
                <p>Bridge the gap between job seekers and employers</p>
                <div className="flex gap-4 items-center justify-center">
                    <Button variant={"outline"} className="cursor-pointer">Find technicians</Button>
                    <Button variant={"default"} className="cursor-pointer">Become a Technician</Button>
                </div>
            </div>
            {/*How it works section*/}
            <div className="flex flex-col items-center justify-center gap-4" id="#how-it-works">
                <h2 className="text-2xl font-bold">How it works</h2>
                <p>1. Find technicians near you</p>
                <p>2. Book an appointment</p>
                <p>3. Get your job done</p>
            </div>
        </main>
        </>
    );
}
