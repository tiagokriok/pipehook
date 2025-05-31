import type { User } from '@supabase/supabase-js'
import { type ReactNode, useEffect, useState } from 'react'

import { AuthContext } from '@/contexts/AuthContext'
import { Supabase } from '@/lib/supabase'

function AuthProvider({ children }: { children: ReactNode }) {
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

export default AuthProvider
