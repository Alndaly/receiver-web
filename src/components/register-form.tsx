'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createUserEmailCode, createEmailUserVerify } from '@/service/user';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

const formSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(6).max(50),
		passwordAgain: z.string().min(6).max(50),
		code: z.string().min(4).max(10),
	})
	.refine((data) => data.password === data.passwordAgain, {
		message: 'Passwords must match',
		path: ['passwordAgain'], // 指定错误信息显示在哪个字段上
	});

export function RegisterForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			passwordAgain: '',
			code: '',
		},
	});

	const router = useRouter();

	const defaultTime = 60;
	const [codeSendingStatus, setCodeSendingStatus] = useState<string | null>(
		null
	);
	const [submitStatus, setSubmitStatus] = useState<boolean | null>(false);
	const [countDownSeconds, setCountDownSeconds] = useState(defaultTime);

	const onSendCode = async () => {
		setCodeSendingStatus('sending');
		const [res, err] = await createUserEmailCode(form.getValues('email'));
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

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

		return form.handleSubmit(onSuccess, onError)(event);
	};

	const onSuccess = async (values: z.infer<typeof formSchema>) => {
		setSubmitStatus(true);
		const [res, err] = await createEmailUserVerify(
			values.email,
			values.email,
			values.password,
			values.code
		);
		if (err) {
			toast.error(err.message);
			setSubmitStatus(false);
			return;
		}
		toast.success('Register success');
		Cookies.set('access_token', res.access_token, {
			expires: res.expires_in / 1000,
		});
		Cookies.set('refresh_token', res.refresh_token);
		setSubmitStatus(false);
		router.push('/dashboard');
	};

	const onError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	return (
		<Card className='mx-auto max-w-sm'>
			<Form {...form}>
				<form onSubmit={onSubmit} className='space-y-2'>
					<CardHeader>
						<CardTitle className='text-2xl'>Register</CardTitle>
						<CardDescription>
							Enter your info to create an account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder='Please write your email'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='grid gap-2'>
								<FormField
									control={form.control}
									name='code'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Code</FormLabel>
											<div className='flex w-full max-w-sm items-center space-x-2'>
												<FormControl>
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
										</FormItem>
									)}
								/>
							</div>
							<div className='grid gap-2'>
								<FormField
									control={form.control}
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
							</div>
							<div className='grid gap-2'>
								<FormField
									control={form.control}
									name='passwordAgain'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password Again</FormLabel>
											<FormControl>
												<Input
													type='password'
													placeholder='Please write your password again'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button className='w-full' type='submit'>
								{submitStatus && (
									<Loader2 className='mr-1 h-4 w-4 animate-spin' />
								)}
								Register
							</Button>
						</div>
						<div className='mt-4 text-center text-sm'>
							Already have an account?{' '}
							<Link href='/login' className='underline'>
								Login
							</Link>
						</div>
						<Link
							className='underline text-center text-sm'
							href={'https://docs.receiver.qingyon.com'}
							target='_blank'>
							docs here
						</Link>
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}
