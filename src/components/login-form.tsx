'use client';

import Link from 'next/link';
import GitHubIcon from './icons/github-icon';
import GoogleIcon from './icons/google-icon';
import { Smartphone, Mail } from 'lucide-react';
import { createSMSUserVerify, createUserSMSCode, loginUser } from '@/service/user';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

const emailFormSchema = z.object({
	email: z.string().min(2).max(50),
	password: z.string().min(6).max(50),
});

const phoneFormSchema = z.object({
	phone: z.string().min(2).max(50),
	code: z.string().min(6).max(50),
});

export function LoginForm() {
	const router = useRouter();
	const [submitStatus, setSubmitStatus] = useState<boolean>(false);
	const [loginWay, setLoginWay] = useState('email');
	const defaultTime = 60;
	const [codeSendingStatus, setCodeSendingStatus] = useState<string | null>(
		null
	);
	const [countDownSeconds, setCountDownSeconds] = useState(defaultTime);

	const emailForm = useForm<z.infer<typeof emailFormSchema>>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
		resolver: zodResolver(phoneFormSchema),
		defaultValues: {
			phone: '',
			code: '',
		},
	});

	const onSubmitPhoneForm = async (event: React.FormEvent<HTMLFormElement>) => {
		// this part is for stopping parent forms to trigger their submit
		if (event) {
			// sometimes not true, e.g. React Native
			if (typeof event.preventDefault === 'function') {
				event.preventDefault();
			}
			if (typeof event.stopPropagation === 'function') {
				// prevent any outer forms from receiving the event too
				event.stopPropagation();
			}
		}

		return phoneForm.handleSubmit(
			onPhoneSubmitSuccess,
			onPhoneSubmitError
		)(event);
	};

	const onSubmitEmailForm = async (event: React.FormEvent<HTMLFormElement>) => {
		// this part is for stopping parent forms to trigger their submit
		if (event) {
			// sometimes not true, e.g. React Native
			if (typeof event.preventDefault === 'function') {
				event.preventDefault();
			}
			if (typeof event.stopPropagation === 'function') {
				// prevent any outer forms from receiving the event too
				event.stopPropagation();
			}
		}

		return emailForm.handleSubmit(
			onEmailSubmitSuccess,
			onEmailSubmitError
		)(event);
	};

	const onEmailSubmitSuccess = async (
		values: z.infer<typeof emailFormSchema>
	) => {
		setSubmitStatus(true);
		const [res, err] = await loginUser(values.email, values.password);
		if (err) {
			toast.error(err.message);
			setSubmitStatus(false);
			return;
		}
		Cookies.set('access_token', res.access_token, {
			expires: res.expires_in / 1000,
		});
		Cookies.set('refresh_token', res.refresh_token);
		toast.success('Login successful');
		setSubmitStatus(false);
		router.push('/dashboard');
	};

	const onEmailSubmitError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const onPhoneSubmitSuccess = async (
		values: z.infer<typeof phoneFormSchema>
	) => {
		setSubmitStatus(true);
		const [res, err] = await createSMSUserVerify(values.phone, values.code);
		if (err) {
			toast.error(err.message);
			setSubmitStatus(false);
			return;
		}
		Cookies.set('access_token', res.access_token, {
			expires: res.expires_in / 1000,
		});
		Cookies.set('refresh_token', res.refresh_token);
		toast.success('Login successful');
		setSubmitStatus(false);
		router.push('/dashboard');
	};

	const onPhoneSubmitError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const handleGitHubLogin = () => {
		// the client id from github
		const client_id = 'Iv23liJSg8YL7I1GVbJ8';
		// redirect the user to github
		const link = `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${window.location.origin}/integrations/github/oauth2/create/callback`;
		window.location.assign(link);
	};

	const handleGoogleLogin = () => {
		// the client id from github
		const client_id =
			'417378210659-r3l1uobmi4f5vvfheip1rkh7njhhekrc.apps.googleusercontent.com';
		// redirect the user to github
		const link = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${window.location.origin}/integrations/google/oauth2/create/callback&scope=openid email profile&response_type=code`;
		window.location.assign(link);
	};

	const onSendCode = async () => {
		setCodeSendingStatus('sending');
		const [res, err] = await createUserSMSCode(phoneForm.getValues('phone'));
		if (err) {
			toast.error(err.message);
			setCodeSendingStatus(null);
			return;
		}
		const countDownInterval = setInterval(() => {
			setCountDownSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(countDownInterval);
					setCodeSendingStatus(null);
					return defaultTime;
				}
				return prev - 1;
			});
		}, 1000);
		toast.success('验证码发送成功');
		setCodeSendingStatus('done');
	};

	return (
		<Card className='border-none'>
			{loginWay === 'phone' && (
				<Form {...phoneForm}>
					<form onSubmit={onSubmitPhoneForm} className='space-y-2'>
						<CardHeader>
							<CardTitle className='text-2xl'>Login</CardTitle>
							<CardDescription>
								Enter your phone number below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<FormField
								control={phoneForm.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input
												placeholder='Please write your phone number'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={phoneForm.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Code</FormLabel>
										<div className='flex flex-col space-y-2'>
											<div className='flex-row flex w-full items-center space-x-2'>
												<FormControl className='flex-1'>
													<Input
														placeholder='Please write your code'
														{...field}
													/>
												</FormControl>
												<Button
													type='button'
													onClick={onSendCode}
													disabled={codeSendingStatus !== null}>
													{codeSendingStatus === 'sending' && (
														<Loader2 className='mr-1 h-4 w-4 animate-spin' />
													)}
													{codeSendingStatus !== 'done' && 'Send Code'}
													{codeSendingStatus === 'done' &&
														`After ${countDownSeconds}s`}
												</Button>
											</div>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className='flex flex-col gap-2'>
							<Button type='submit' className='w-full'>
								{submitStatus && (
									<Loader2 className='mr-1 h-4 w-4 animate-spin' />
								)}
								Login
							</Button>
							<div className='w-full flex-1 flex flex-row gap-2'>
								<Button
									type='button'
									className='w-full'
									onClick={handleGitHubLogin}>
									GitHub Login
									<GitHubIcon />
								</Button>
								<Button
									type='button'
									className='w-full'
									onClick={handleGoogleLogin}>
									Google Login
									<GoogleIcon />
								</Button>
								<Button
									type='button'
									className='w-full'
									onClick={() => {
										setLoginWay('email');
									}}>
									Email Login
									<Mail />
								</Button>
							</div>
							<div className='mt-4 text-center text-sm'>
								Don&apos;t have an account?{' '}
								<Link href='/register' className='underline'>
									Sign up
								</Link>
							</div>
							<Link
								className='underline text-center text-sm'
								href={'#'}
								target='_blank'>
								docs here
							</Link>
						</CardFooter>
					</form>
				</Form>
			)}
			{loginWay === 'email' && (
				<Form {...emailForm}>
					<form onSubmit={onSubmitEmailForm} className='space-y-2'>
						<CardHeader>
							<CardTitle className='text-2xl'>Login</CardTitle>
							<CardDescription>
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<FormField
								control={emailForm.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='Please write your email' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={emailForm.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type='password'
												placeholder='Please write your password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className='flex flex-col gap-2'>
							<Button type='submit' className='w-full'>
								{submitStatus && (
									<Loader2 className='mr-1 h-4 w-4 animate-spin' />
								)}
								Login
							</Button>
							<div className='w-full flex-1 flex flex-row gap-2'>
								<Button
									type='button'
									className='w-full'
									onClick={handleGitHubLogin}>
									GitHub Login
									<GitHubIcon />
								</Button>
								<Button
									type='button'
									className='w-full'
									onClick={handleGoogleLogin}>
									Google Login
									<GoogleIcon />
								</Button>
								<Button
									type='button'
									className='w-full'
									onClick={() => {
										setLoginWay('phone');
									}}>
									Phone Login
									<Smartphone />
								</Button>
							</div>
							<div className='mt-4 text-center text-sm'>
								Don&apos;t have an account?{' '}
								<Link href='/register' className='underline'>
									Sign up
								</Link>
							</div>
							<Link
								className='underline text-center text-sm'
								href={'#'}
								target='_blank'>
								docs here
							</Link>
						</CardFooter>
					</form>
				</Form>
			)}
		</Card>
	);
}
