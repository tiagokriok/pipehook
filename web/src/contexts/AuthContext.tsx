import type { User } from '@supabase/supabase-js'
import { createContext } from 'react'

interface AuthContextType {
	user: User | null
	loading: boolean
	isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
