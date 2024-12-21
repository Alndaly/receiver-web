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
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function LoginForm() {
	const router = useRouter();
	const [submitStatus, setSubmitStatus] = useState<boolean>(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const onSubmit = async () => {
		setSubmitStatus(true);
		const [res, err] = await loginUser(email, password);
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
	return (
		<Card className='border-none'>
			<CardHeader>
				<CardTitle className='text-2xl'>Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className='grid gap-2'>
						<div className='flex items-center'>
							<Label htmlFor='password'>Password</Label>
						</div>
						<Input
							id='password'
							type='password'
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Button type='submit' className='w-full' onClick={onSubmit}>
						{submitStatus && <Loader2 className='mr-1 h-4 w-4 animate-spin' />}
						Login
					</Button>
				</div>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/register' className='underline'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
