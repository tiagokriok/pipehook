import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { Calendar, CheckCircle, Copy, Mail, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function Page() {
	const { user } = useUser();
	const { getToken } = useAuth();
	const [token, setToken] = useState<string | null>(null);
	const [tokenError, setTokenError] = useState<string | null>(null);
	const [tokenCopied, setTokenCopied] = useState(false);
	const [apiTestResult, setApiTestResult] = useState<string | null>(null);
	const [apiTestLoading, setApiTestLoading] = useState(false);

	// Fetch JWT token for development/testing purposes
	useEffect(() => {
		if (import.meta.env.DEV && user) {
			const fetchToken = async () => {
				try {
					const token = await getToken();
					setToken(token);
					setTokenError(null);
				} catch (error) {
					setTokenError(error instanceof Error ? error.message : 'Failed to get token');
					setToken(null);
				}
			};

			fetchToken();
		}
	}, [user, getToken]);

	const copyTokenToClipboard = async () => {
		if (token) {
			try {
				await navigator.clipboard.writeText(token);
				setTokenCopied(true);
				setTimeout(() => setTokenCopied(false), 2000);
			} catch (error) {
				console.error('Failed to copy token:', error);
			}
		}
	};

	const testApiCall = async () => {
		setApiTestLoading(true);
		setApiTestResult(null);
		
		try {
			// Test the health endpoint (public)
			const healthResult = await api.health.check();
			setApiTestResult(`✅ Health check successful: ${JSON.stringify(healthResult)}`);
		} catch (error) {
			if (error instanceof Error) {
				setApiTestResult(`❌ API Error: ${error.message}`);
			} else {
				setApiTestResult(`❌ Unknown error: ${JSON.stringify(error)}`);
			}
		} finally {
			setApiTestLoading(false);
		}
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	};

	return (
		<div className="container mx-auto py-8 space-y-6">
			{/* Success Alert */}
			<Alert className="border-green-200 bg-green-50 text-green-800">
				<CheckCircle className="h-4 w-4" />
				<AlertDescription className="font-medium">
					🎉 Successfully signed in! Welcome to PipeHook.
				</AlertDescription>
			</Alert>

			{/* Welcome Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Welcome back!</CardTitle>
					<CardDescription>
						You're successfully signed in and ready to use PipeHook.
					</CardDescription>
				</CardHeader>
			</Card>

			{/* User Information Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Your Profile
					</CardTitle>
					<CardDescription>
						Your account information and details
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* User Avatar and Name */}
					<div className="flex items-center gap-4">
						<div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
							{user.imageUrl ? (
								<img
									src={user.imageUrl}
									alt="Profile"
									className="h-16 w-16 rounded-full object-cover"
								/>
							) : (
								<span>
									{user.firstName?.[0]?.toUpperCase() || ""}
									{user.lastName?.[0]?.toUpperCase() || ""}
								</span>
							)}
						</div>
						<div>
							<h3 className="text-xl font-semibold">
								{user.fullName || "Anonymous User"}
							</h3>
							<p className="text-muted-foreground">
								{user.primaryEmailAddress?.emailAddress}
							</p>
						</div>
					</div>

					{/* User Details Grid */}
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Mail className="h-4 w-4" />
								Email Address
							</div>
							<p className="text-muted-foreground pl-6">
								{user.primaryEmailAddress?.emailAddress || "Not provided"}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<User className="h-4 w-4" />
								Full Name
							</div>
							<p className="text-muted-foreground pl-6">
								{user.fullName || "Not provided"}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Calendar className="h-4 w-4" />
								Member Since
							</div>
							<p className="text-muted-foreground pl-6">
								{formatDate(user.createdAt!)}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<CheckCircle className="h-4 w-4" />
								Email Verified
							</div>
							<p className="text-muted-foreground pl-6">
								{user.primaryEmailAddress?.verification?.status === "verified"
									? "✅ Verified"
									: "❌ Not verified"}
							</p>
						</div>
					</div>

					{/* User Menu */}
					<div className="pt-4 border-t">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								Account Management
							</span>
							<UserButton
								appearance={{
									elements: {
										avatarBox: "h-10 w-10",
									},
								}}
								showName={true}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* JWT Token (Development) */}
			{import.meta.env.DEV && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm flex items-center gap-2">
							🔑 JWT Token
							<span className="text-xs font-normal text-muted-foreground">
								(Development Only)
							</span>
						</CardTitle>
						<CardDescription className="text-xs">
							Use this token for API testing. Copy it to your clipboard and include it in Authorization headers.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{tokenError ? (
							<Alert variant="destructive">
								<AlertDescription className="text-xs">
									Error fetching token: {tokenError}
								</AlertDescription>
							</Alert>
						) : token ? (
							<>
								<div className="space-y-2">
									<label className="text-xs font-medium">Bearer Token:</label>
									<div className="flex items-center gap-2">
										<div className="flex-1 text-xs bg-muted p-3 rounded font-mono break-all">
											{token}
										</div>
										<Button
											size="sm"
											variant="outline"
											onClick={copyTokenToClipboard}
											className="flex-shrink-0"
										>
											<Copy className="h-3 w-3" />
											{tokenCopied ? "Copied!" : "Copy"}
										</Button>
									</div>
								</div>
								
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<label className="text-xs font-medium">API Test:</label>
										<Button
											size="sm"
											variant="secondary"
											onClick={testApiCall}
											disabled={apiTestLoading}
											className="flex items-center gap-1"
										>
											<Zap className="h-3 w-3" />
											{apiTestLoading ? "Testing..." : "Test Health API"}
										</Button>
									</div>
									{apiTestResult && (
										<div className="text-xs bg-muted p-2 rounded font-mono">
											{apiTestResult}
										</div>
									)}
								</div>
								
								<div className="text-xs text-muted-foreground space-y-1">
									<p><strong>Usage:</strong> Add to request headers as:</p>
									<code className="bg-muted px-2 py-1 rounded">
										Authorization: Bearer {token.slice(0, 20)}...
									</code>
									<p className="text-xs mt-1">
										<strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}
									</p>
								</div>
							</>
						) : (
							<div className="text-xs text-muted-foreground">Loading token...</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Debug Information (Development) */}
			{import.meta.env.DEV && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">User Debug Information</CardTitle>
						<CardDescription className="text-xs">
							Development only - User object details
						</CardDescription>
					</CardHeader>
					<CardContent>
						<pre className="text-xs bg-muted p-4 rounded overflow-auto">
							{JSON.stringify(user, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default Page;
