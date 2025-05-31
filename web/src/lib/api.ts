import axios from 'axios'
import { Supabase } from './supabase'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(async (config) => {
	const {
		data: { session },
	} = await Supabase.auth.getSession()

	if (session?.access_token) {
		config.headers.Authorization = `Bearer ${session.access_token}`
	}

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			Supabase.auth.signOut().catch(console.error)
		}

		return Promise.reject(error)
	},
)
