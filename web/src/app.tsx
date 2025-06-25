import { SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react'
import { Route, Routes } from 'react-router-dom'

import AppLayout from '@/layouts/App'
import Dashboard from '@/pages/app/Dashboard'

function App() {
	return (
		<Routes>
			{/* Public Routes - Sign In */}
			<Route 
				path="/sign-in/*" 
				element={
					<SignedOut>
						<div className="flex min-h-screen items-center justify-center bg-gray-50">
							<SignIn routing="path" path="/sign-in" />
						</div>
					</SignedOut>
				} 
			/>
			
			{/* Public Routes - Sign Up */}
			<Route 
				path="/sign-up/*" 
				element={
					<SignedOut>
						<div className="flex min-h-screen items-center justify-center bg-gray-50">
							<SignUp routing="path" path="/sign-up" />
						</div>
					</SignedOut>
				} 
			/>

			{/* Root route - redirect to sign-in if not authenticated */}
			<Route 
				path="/" 
				element={
					<>
						<SignedIn>
							<AppLayout>
								<Dashboard />
							</AppLayout>
						</SignedIn>
						<SignedOut>
							<div className="flex min-h-screen items-center justify-center bg-gray-50">
								<SignIn routing="path" path="/sign-in" />
							</div>
						</SignedOut>
					</>
				} 
			/>

			{/* Private Routes */}
			<Route 
				path="/dashboard" 
				element={
					<SignedIn>
						<AppLayout>
							<Dashboard />
						</AppLayout>
					</SignedIn>
				} 
			/>

			{/* Catch all other routes - redirect to sign in if not authenticated */}
			<Route 
				path="*" 
				element={
					<>
						<SignedIn>
							<RedirectToSignIn />
						</SignedIn>
						<SignedOut>
							<RedirectToSignIn />
						</SignedOut>
					</>
				} 
			/>
		</Routes>
	)
}

export default App
