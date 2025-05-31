import { Supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
	const [loading, setLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		Supabase.auth.getSession().then(({ data: { session } }) => {
			setIsAuthenticated(session !== null)
			setLoading(false)
		})
	}, [])

	if (loading) {
		return <div>Loading...</div>
	}

	if (isAuthenticated) {
		return <Outlet />
	} else {
		return <Navigate to="/" />
	}
}

export default PrivateRoute
