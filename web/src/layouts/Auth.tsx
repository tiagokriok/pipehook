import { Outlet } from 'react-router-dom'

function AuthLayout() {
	return (
		<div>
			<h2>Auth</h2>
			<Outlet />
		</div>
	)
}

export default AuthLayout
