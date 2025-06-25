import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create base axios instance
const createAxiosInstance = (requireAuth = false): AxiosInstance => {
	const instance = axios.create({
		baseURL: API_BASE_URL,
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	// Request interceptor for authentication
	instance.interceptors.request.use(
		async (config) => {
			if (requireAuth) {
				// This is a placeholder for the token injection logic
				// Actual token injection happens in createAuthenticatedRequest function
				console.log('🔐 Request interceptor: Auth required for', config.url)
			}
			
			return config
		},
		(error) => {
			console.error('❌ Request interceptor error:', error)
			return Promise.reject(error)
		}
	)

	// Response interceptor for error handling
	instance.interceptors.response.use(
		(response: AxiosResponse) => {
			console.log('✅ API Response:', response.status, response.config.url)
			return response
		},
		(error) => {
			console.error('❌ API Error:', error.response?.status, error.config?.url, error.message)
			
			// Handle different error types
			if (error.response) {
				// Server responded with error status
				const { status, data } = error.response
				
				switch (status) {
					case 401:
						console.error('🔒 Unauthorized - Invalid or expired token')
						// Could trigger logout or token refresh here
						break
					case 403:
						console.error('🚫 Forbidden - Insufficient permissions')
						break
					case 404:
						console.error('🔍 Not Found - Resource does not exist')
						break
					case 500:
						console.error('🔥 Server Error - Internal server error')
						break
					default:
						console.error(`📡 HTTP ${status} - ${data?.message || 'Unknown error'}`)
				}
			} else if (error.request) {
				// Request was made but no response received
				console.error('📡 Network Error - No response from server')
			} else {
				// Something else happened
				console.error('⚡ Request Error:', error.message)
			}
			
			return Promise.reject(error)
		}
	)

	return instance
}

// Create authenticated API client
export const apiClient = createAxiosInstance(true)

// Create public API client (no auth required)
export const publicApiClient = createAxiosInstance(false)

// Helper function to create authenticated requests
export const createAuthenticatedRequest = async (getToken: () => Promise<string | null>) => {
	return axios.create({
		baseURL: API_BASE_URL,
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
		},
		transformRequest: [
			async (data, headers) => {
				// Get fresh token for each request
				const token = await getToken()
				if (token && headers) {
					headers.Authorization = `Bearer ${token}`
				}
				return data
			},
		],
	})
}

// Type definitions for API responses
export interface ApiResponse<T = unknown> {
	data: T
	message?: string
	success: boolean
}

export interface ApiError {
	message: string
	code?: string
	status?: number
}

// Helper function to handle API calls with proper error handling
export const apiCall = async <T>(
	requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
	try {
		const response = await requestFn()
		return response.data.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const apiError: ApiError = {
				message: error.response?.data?.message || error.message,
				code: error.code,
				status: error.response?.status,
			}
			throw apiError
		}
		throw error
	}
}

// Example API methods (can be expanded as needed)
export const api = {
	// User related endpoints
	user: {
		getProfile: async (getToken: () => Promise<string | null>) => {
			const client = await createAuthenticatedRequest(getToken)
			return apiCall(() => client.get('/user/profile'))
		},
		updateProfile: async (data: Record<string, unknown>, getToken: () => Promise<string | null>) => {
			const client = await createAuthenticatedRequest(getToken)
			return apiCall(() => client.put('/user/profile', data))
		},
	},
	
	// Webhook related endpoints
	webhooks: {
		list: async (getToken: () => Promise<string | null>) => {
			const client = await createAuthenticatedRequest(getToken)
			return apiCall(() => client.get('/webhooks'))
		},
		create: async (data: Record<string, unknown>, getToken: () => Promise<string | null>) => {
			const client = await createAuthenticatedRequest(getToken)
			return apiCall(() => client.post('/webhooks', data))
		},
		get: async (id: string, getToken: () => Promise<string | null>) => {
			const client = await createAuthenticatedRequest(getToken)
			return apiCall(() => client.get(`/webhooks/${id}`))
		},
		update: async (id: string, data: Record<string, unknown>, getToken: () => Promise<string | null>) => {
			const client = await createAuthenticatedRequest(getToken)
			return apiCall(() => client.put(`/webhooks/${id}`, data))
		},
		delete: async (id: string, getToken: () => Promise<string | null>) => {
			const client = await createAuthenticatedRequest(getToken)
			return apiCall(() => client.delete(`/webhooks/${id}`))
		},
	},

	// Public endpoints (no auth required)
	health: {
		check: () => apiCall(() => publicApiClient.get('/health')),
	},
}

export default api