'use client';

import Link from 'next/link';

import { loginUser } from '@/service/user';
import { Loader2, Mail, Smartphone, ScanQrCode } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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

const formSchema = z.object({
	email: z.string().min(2).max(50),
	password: z.string().min(6).max(50),
});

export function LoginForm() {
	const router = useRouter();
	const [submitStatus, setSubmitStatus] = useState<boolean>(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

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

	const onError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	return (
		<Card className='border-none'>
			<Form {...form}>
				<form onSubmit={onSubmit} className='space-y-2'>
					<CardHeader>
						<CardTitle className='text-2xl'>Login</CardTitle>
						<CardDescription>
							Enter your email below to login to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
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
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											placeholder='Please write your password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className='flex flex-col'>
						<Button type='submit' className='w-full'>
							{submitStatus && (
								<Loader2 className='mr-1 h-4 w-4 animate-spin' />
							)}
							Login
						</Button>
						<div className='mt-4 text-center text-sm'>
							Don&apos;t have an account?{' '}
							<Link href='/register' className='underline'>
								Sign up
							</Link>
						</div>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
