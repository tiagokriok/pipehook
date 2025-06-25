import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Calendar, CheckCircle, Mail, User } from "lucide-react";

function Page() {
	const { user } = useUser();

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

			{/* Debug Information (Development) */}
			{import.meta.env.NODE_ENV === "development" && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Debug Information</CardTitle>
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
