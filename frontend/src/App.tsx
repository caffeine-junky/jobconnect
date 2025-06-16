import * as authService from "@/lib/services/auth";
import type { LoginRequest } from "./lib/types/auth";

export default function App() {

	const login = async () => {
		const form: LoginRequest = {
			email: "moses@jobconnect.com",
			password: "123",
			user_role: "ADMIN"
		}
		const token = await authService.login(form);
		console.log(token);
		const user = await authService.get_current_user(token.access_token);
		console.table(user)
	}

	login()

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
			<h1 className="text-3xl font-bold">JobConnect</h1>
		</div>
	);
}
