import { Supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { createContext, type ReactNode, useEffect, useState } from 'react'

interface AuthContextType {
	user: User | null
	loading: boolean
	isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Supabase.auth.getUser().then(({ data: { user } }) => {
			setUser(user)
			setLoading(false)
		})

		const { data: listener } = Supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user || null)
		})

		return () => {
			listener.subscription.unsubscribe()
		}
	}, [])

	return (
		<AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
			{children}
		</AuthContext.Provider>
	)
}
