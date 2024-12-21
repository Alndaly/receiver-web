'use client';
import React from 'react';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Copy, Loader2, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { updatePassword, updatePasswordEmailCode } from '@/service/user';

const passwordFormSchema = z.object({
	password: z.string().min(8).max(40),
	code: z.string().min(1).max(40),
});

const PassWordUpdate = () => {
	const [open, setOpen] = React.useState(false);
	const defaultTime = 60;
	const [codeSendingStatus, setCodeSendingStatus] = useState<string | null>(
		null
	);
	const [countDownSeconds, setCountDownSeconds] = useState(defaultTime);

	const form = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			password: '',
			code: '',
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

	const onSuccess = async (values: z.infer<typeof passwordFormSchema>) => {
		const [res, err] = await updatePassword(values.password, values.code);
		if (err) {
			toast.error(err.message);
			return;
		}
		toast.success('更新成功');
		setOpen(false);
	};

	const onError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const onGetCode = async () => {
		setCodeSendingStatus('sending');
		const [res, err] = await updatePasswordEmailCode();
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
		toast('发送成功');
		setCodeSendingStatus('done');
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>更改密码</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>更改密码</DialogTitle>
					<DialogDescription>
						更改密码需发送验证码到邮箱，验证码正确才可修改。
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className='space-y-5'>
						<div className='space-y-5'>
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem className='flex justify-between items-center gap-2 space-y-0'>
										<div className='flex flex-col gap-2 flex-1'>
											<FormControl>
												<Input
													type='text'
													placeholder='请输入验证码'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
										<Button
											type='button'
											onClick={onGetCode}
											disabled={codeSendingStatus !== null}>
											{codeSendingStatus === 'sending' && (
												<Loader2 className='mr-1 h-4 w-4 animate-spin' />
											)}
											{codeSendingStatus !== 'done' && 'Send Code'}
											{codeSendingStatus === 'done' &&
												`After ${countDownSeconds}s`}
										</Button>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem className='flex justify-between items-center space-y-0'>
										<FormLabel className='flex flex-col gap-2'>
											输入新密码
											<FormDescription>不得少于8位</FormDescription>
										</FormLabel>
										<div className='flex flex-col gap-2'>
											<FormControl>
												<Input type='password' placeholder='密码' {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className='sm:justify-end'>
							<Button type='submit'>确认</Button>
							<DialogClose asChild>
								<Button type='button' variant='secondary'>
									取消
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default PassWordUpdate;
