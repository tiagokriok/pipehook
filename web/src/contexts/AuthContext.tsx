import { createContext } from 'react'

interface AuthContextType {
	user: any | null
	loading: boolean
	isAuthenticated: boolean
	signIn: () => void
	signOut: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
