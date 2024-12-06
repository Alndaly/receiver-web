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
import { createUserEmail, createUser } from '@/service/user';
import { toast } from 'sonner';

export function RegisterForm() {
	const router = useRouter();

	const defaultTime = 60;
	const [codeSendingStatus, setCodeSendingStatus] = useState<string | null>(
		null
	);
	const [submitStatus, setSubmitStatus] = useState<boolean | null>(false);
	const [countDownSeconds, setCountDownSeconds] = useState(defaultTime);
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const [passwordAgain, setPasswordAgain] = useState('');

	const onSendCode = async () => {
		setCodeSendingStatus('sending');
		const [res, err] = await createUserEmail(email);
		if (err) {
			setCodeSendingStatus('error');
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
		toast.success('Code sent to your email');
		setCodeSendingStatus('done');
	};

	const onSubmit = async () => {
		setSubmitStatus(true);
		const [res, err] = await createUser(email, email, password, code);
		if (err) {
			toast.error(err.detail);
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

	return (
		<Card className='mx-auto max-w-sm'>
			<CardHeader>
				<CardTitle className='text-2xl'>Register</CardTitle>
				<CardDescription>Enter your info to create an account</CardDescription>
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
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Code</Label>
						<div className='flex w-full max-w-sm items-center space-x-2'>
							<Input
								type='text'
								value={code}
								onChange={(e) => {
									setCode(e.target.value);
								}}
							/>
							<Button
								onClick={onSendCode}
								disabled={codeSendingStatus !== null}>
								{codeSendingStatus === 'sending' && (
									<Loader2 className='mr-1 h-4 w-4 animate-spin' />
								)}
								{codeSendingStatus !== 'done' && 'Send Code'}
								{codeSendingStatus === 'done' && `After ${countDownSeconds}s`}
							</Button>
						</div>
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='password'>Password</Label>
						<Input
							id='password'
							type='password'
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='password_again'>Password Again</Label>
						<Input
							id='password_again'
							type='password'
							required
							value={passwordAgain}
							onChange={(e) => setPasswordAgain(e.target.value)}
						/>
					</div>
					<Button className='w-full' onClick={onSubmit}>
						{submitStatus && <Loader2 className='mr-1 h-4 w-4 animate-spin' />}
						Register
					</Button>
				</div>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href='/login' className='underline'>
						Login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
