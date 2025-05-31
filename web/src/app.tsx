import { Route, Routes } from 'react-router-dom'

import PrivateRoute from '@/components/PrivateRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import AppLayout from '@/layouts/App'
import AuthLayout from '@/layouts/Auth'
import Dashboard from '@/pages/app/Dashboard'
import Login from '@/pages/auth/Login'

function App() {
	return (
		<AuthProvider>
			<Routes>
				{/* Public Routes */}
				<Route element={<AuthLayout />}>
					<Route path="/" element={<Login />} />
				</Route>

				{/* Private Routes */}
				<Route element={<PrivateRoute />}>
					<Route element={<AppLayout />}>
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>
				</Route>
			</Routes>
		</AuthProvider>
	)
}

export default App
