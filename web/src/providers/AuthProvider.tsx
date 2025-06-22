import { useAuth, useUser } from '@clerk/clerk-react'
import { type ReactNode } from 'react'

import { AuthContext } from '@/contexts/AuthContext'

function AuthProvider({ children }: { children: ReactNode }) {
	const { isLoaded, isSignedIn, signOut } = useAuth()
	const { user } = useUser()

	const signIn = () => {
		window.location.href = '/sign-in'
	}

	return (
		<AuthContext.Provider 
			value={{ 
				user, 
				loading: !isLoaded, 
				isAuthenticated: !!isSignedIn,
				signIn,
				signOut
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
