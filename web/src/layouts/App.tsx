import { useUser, UserButton } from '@clerk/clerk-react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppLayoutProps {
	children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
	const { user } = useUser()

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					{/* Logo/Brand */}
					<div className="flex items-center space-x-4">
						<h1 className="text-xl font-bold">PipeHook</h1>
					</div>

					{/* User Menu */}
					{user && (
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-3">
								{/* User Avatar */}
								<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
									{user.imageUrl ? (
										<img
											src={user.imageUrl}
											alt="Profile"
											className="h-8 w-8 rounded-full object-cover"
										/>
									) : (
										<span>
											{user.firstName?.[0]?.toUpperCase() || ''}
											{user.lastName?.[0]?.toUpperCase() || ''}
										</span>
									)}
								</div>
								
								{/* User Info */}
								<div className="hidden md:block">
									<p className="text-sm font-medium">{user.fullName || 'User'}</p>
									<p className="text-xs text-muted-foreground">
										{user.primaryEmailAddress?.emailAddress}
									</p>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm">
									<Settings className="h-4 w-4" />
									<span className="hidden sm:inline-block ml-2">Settings</span>
								</Button>
								<UserButton 
									appearance={{
										elements: {
											avatarBox: "h-8 w-8"
										}
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1">
				{children}
			</main>
		</div>
	)
}

export default AppLayout
