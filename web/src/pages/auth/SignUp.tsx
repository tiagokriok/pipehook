import { useSignUp } from '@clerk/clerk-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

interface SignUpForm {
	email: string
	password: string
	firstName: string
	lastName: string
}

function Page() {
	const { isLoaded, signUp, setActive } = useSignUp()
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [pendingVerification, setPendingVerification] = useState(false)
	const [code, setCode] = useState('')
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpForm>()

	const onSubmit = async (data: SignUpForm) => {
		if (!isLoaded) return

		setIsLoading(true)
		setError('')

		try {
			await signUp.create({
				emailAddress: data.email,
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
			})

			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
			setPendingVerification(true)
		} catch (err: any) {
			setError(err.errors?.[0]?.message || 'Something went wrong')
		} finally {
			setIsLoading(false)
		}
	}

	const onPressVerify = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isLoaded) return

		setIsLoading(true)
		setError('')

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			})

			if (completeSignUp.status === 'complete') {
				await setActive({ session: completeSignUp.createdSessionId })
				navigate('/dashboard')
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.message || 'Something went wrong')
		} finally {
			setIsLoading(false)
		}
	}

	const signUpWithGoogle = async () => {
		if (!isLoaded) return

		try {
			await signUp.authenticateWithRedirect({
				strategy: 'oauth_google',
				redirectUrl: '/dashboard',
				redirectUrlComplete: '/dashboard',
			})
		} catch (err: any) {
			setError(err.errors?.[0]?.message || 'Something went wrong')
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">
						{pendingVerification ? 'Verify your email' : 'Create an account'}
					</CardTitle>
					<CardDescription>
						{pendingVerification
							? 'Enter the verification code sent to your email'
							: 'Enter your details to get started'}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{!pendingVerification ? (
						<>
							<Button
								variant="outline"
								className="w-full"
								onClick={signUpWithGoogle}
								disabled={!isLoaded}
							>
								<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Continue with Google
							</Button>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>

							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">First name</Label>
										<Input
											id="firstName"
											placeholder="John"
											{...register('firstName', {
												required: 'First name is required',
											})}
										/>
										{errors.firstName && (
											<p className="text-sm text-destructive">
												{errors.firstName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="lastName">Last name</Label>
										<Input
											id="lastName"
											placeholder="Doe"
											{...register('lastName', {
												required: 'Last name is required',
											})}
										/>
										{errors.lastName && (
											<p className="text-sm text-destructive">
												{errors.lastName.message}
											</p>
										)}
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										{...register('email', {
											required: 'Email is required',
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: 'Invalid email address',
											},
										})}
									/>
									{errors.email && (
										<p className="text-sm text-destructive">{errors.email.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										{...register('password', {
											required: 'Password is required',
											minLength: {
												value: 8,
												message: 'Password must be at least 8 characters',
											},
										})}
									/>
									{errors.password && (
										<p className="text-sm text-destructive">{errors.password.message}</p>
									)}
								</div>

								<Button type="submit" className="w-full" disabled={isLoading || !isLoaded}>
									{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Create account
								</Button>
							</form>
						</>
					) : (
						<form onSubmit={onPressVerify} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="code">Verification Code</Label>
								<Input
									id="code"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									placeholder="Enter verification code"
								/>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading || !isLoaded}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Verify Email
							</Button>
						</form>
					)}

					{!pendingVerification && (
						<div className="text-center text-sm">
							Already have an account?{' '}
							<Link to="/" className="underline underline-offset-4 hover:text-primary">
								Sign in
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
			<div className="text-muted-foreground text-center text-xs text-balance">
				By clicking continue, you agree to our{' '}
				<a href="#" className="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>{' '}
				and{' '}
				<a href="#" className="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</div>
		</div>
	)
}

export default Page