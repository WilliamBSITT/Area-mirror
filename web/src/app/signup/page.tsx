// app/login/page.tsx
'use client'
import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { send_signup_forms } from "./signup"


export default function CardDemo() {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const { data, loading, error, handleClick } = send_signup_forms(email, password);

	return (
		<main className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-sm mx-auto">
				<CardHeader>
					<CardTitle>Signup to TriggerHub</CardTitle>
					<CardDescription>
						Enter your informations below to create an account
					</CardDescription>
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
					<Button className="w-full rounded-full" onClick={handleClick} disabled={loading}>
						{"Continue"}
					</Button>
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