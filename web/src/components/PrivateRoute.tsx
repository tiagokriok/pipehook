import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
	const { loading, isAuthenticated } = useAuth()

	if (loading) {
		return <div>Loading...</div>
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute
