import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import { Toaster } from "sonner";

import TechnicianCard from "./components/cards/TechnicianCard";
import type { TechnicianResponse } from "./lib/types/technician";

const t: TechnicianResponse = {
	fullname: "Moses Bongani kubeka",
	email: "mkay.py@gmail.com",
	phone: "0661547228",
	id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
	location: {
		location_name: "Soshanguve Block L",
		latitude: -25.987,
		longitude: 20.767
	},
	rating: 4.5,
	services: ["plumbing", "cleaning"],
	is_available: true,
	is_verified: true,
	is_active: true,
	created_at: ""
}

export default function App() {

	return (
		// <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
		// 	<Router>
		// 		<Routes>
		// 			<Route path="/" element={<LandingPage />} />
		// 			<Route path="/login" element={<LoginPage />} />
		// 			{/* Catch-all route for 404s */}
		// 			<Route path="*" element={<h1>Not Found</h1>} />
		// 		</Routes>
		// 	</Router>
		// 	<Toaster position="top-center" expand={true} richColors />
		// </div>
		<div className="flex h-screen w-screen flex-col p-10">
			<TechnicianCard technician={t} />
		</div>
	);
}
