import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import { Toaster } from "sonner";

export default function App() {

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
			<Router>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					{/* Catch-all route for 404s */}
					<Route path="*" element={<h1>Not Found</h1>} />
				</Routes>
			</Router>
			<Toaster position="top-center" expand={true} richColors />
		</div>
	);
}
