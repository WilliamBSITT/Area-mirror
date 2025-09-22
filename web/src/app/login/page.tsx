// app/login/page.tsx
'use client'
import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { send_login_forms } from "./log"

export default function CardDemo() {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const { data, loading, error, handleClick } = send_login_forms(email, password);
	const [showError, setShowError] = React.useState(false);

	return (
		<main className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-sm mx-auto">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
					<CardAction>
						<Button variant="link" onClick={() => window.location.href = "/signup"}>Sign Up</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<form>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</div>
						</div>
					</form>
				</CardContent>
				<div className="flex items-center w-full justify-center">
					<hr className="flex-grow border-t border-gray-300 max-w-[30%]" />
					<span className="mx-4 text-gray-500">or</span>
					<hr className="flex-grow border-t border-gray-300 max-w-[30%]" />
				</div>
				<CardFooter className="flex-col gap-2">
					<Button
						onClick={async () => {
							setShowError(false);
							await handleClick();
							setTimeout(() => {
								if (!data && !loading) {
									setShowError(true);
								}
							}, 500);
						}}
						disabled={loading}
						className="w-full rounded-full"
					>
						{loading ? "Loading..." : "Login"}
					</Button>
					{showError && (
						<div style={{ color: "red", marginTop: "0.5rem", textAlign: "center" }}>
							Les informations sont incorrectes
						</div>
					)}
					<Button
						variant="outline"
						className="w-full rounded-full flex items-center justify-center gap-2"
						onClick={() => window.location.href = "http://localhost:8080/github/login"}
					>
						<img
							src="/github.svg"
							alt="GitHub"
							className="w-5 h-5"
						/>
						Continue with GitHub
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}