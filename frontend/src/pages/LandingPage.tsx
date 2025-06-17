import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <>
        <header className="flex items-center justify-between p-4 w-full">
            <h2 className="text-2xl font-bold">JobConnect</h2>
            <nav>
                <ul>
                    <li><Link to={"#"}>How It works</Link></li>
                    <li><Button onClick={() => navigate("/login")} variant={"outline"}>Login</Button></li>
                </ul>
            </nav>
        </header>
        <main className="w-screen h-screen flex flex-col items-center justify-center gap-4">
            {/* Hero section */}
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl font-bold">JobConnect</h1>
                <p>Bridge the gap between job seekers and employers</p>
                <div className="flex gap-4 items-center justify-center">
                    <Button variant={"outline"}>Find technicians</Button>
                    <Button variant={"default"}>Become a Technician</Button>
                </div>
            </div>
            {/*How it works section*/}
            <div className="flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">How it works</h2>
                <p>1. Find technicians near you</p>
                <p>2. Book an appointment</p>
                <p>3. Get your job done</p>
            </div>
        </main>
        </>
    );
}
