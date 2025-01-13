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
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { bindEmailCode, bindEmailVerify, unBindEmail } from '@/service/user';
import { useUserStore } from '@/stores/user-store-provider';

const emailFormSchema = z.object({
	email: z.string().email(),
	code: z.string().min(4).max(10),
});

const EmailBind = () => {
	const { userInfo, refreshUserInfo } = useUserStore((state) => state);
	const [unBindingStatus, setUnBindingStatus] = useState<boolean>(false);
	const [submitFormStatus, setSubmitFormStatus] = useState<boolean>(false);
	const [showBindEmailDialogStatus, setShowBindEmailDialogStatus] =
		useState(false);
	const [showAlertDialog, setShowAlertDialog] = useState(false);
	const defaultTime = 60;
	const [codeSendingStatus, setCodeSendingStatus] = useState<string | null>(
		null
	);
	const [countDownSeconds, setCountDownSeconds] = useState(defaultTime);

	const form = useForm<z.infer<typeof emailFormSchema>>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: {
			email: '',
			code: '',
		},
	});

	const onSubmitBindEmailForm = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
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

		return form.handleSubmit(onFormValidateSuccess, onFormValidateError)(event);
	};

	const onFormValidateSuccess = async (
		values: z.infer<typeof emailFormSchema>
	) => {
		setSubmitFormStatus(true);
		const [res, err] = await bindEmailVerify(values.email, values.code);
		if (err) {
			toast.error(err.message);
			setSubmitFormStatus(false);
			return;
		}
		toast.success('更新成功');
		setSubmitFormStatus(false);
		refreshUserInfo();
		setShowBindEmailDialogStatus(false);
	};

	const onFormValidateError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const onSendCode = async () => {
		setCodeSendingStatus('sending');
		const [res, err] = await bindEmailCode(form.getValues('email'));
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

	const handleOnUnBindEmail = async () => {
		setShowAlertDialog(true);
	};

	const handleUnBindEmail = async () => {
		setUnBindingStatus(true);
		const [res, err] = await unBindEmail();
		if (err) {
			toast.error(err.message);
			setUnBindingStatus(false);
			return;
		}
		setUnBindingStatus(false);
		refreshUserInfo();
	};

	return (
		<>
			{!userInfo.email_info && (
				<Button
					variant='outline'
					onClick={() => {
						setShowBindEmailDialogStatus(true);
					}}>
					绑定邮箱
				</Button>
			)}
			{userInfo.email_info && (
				<>
					<div className='flex flex-row items-center'>
						<div className='font-bold text-xs'>{userInfo.email_info.email}</div>
						<Button
							variant={'link'}
							className='text-xs'
							disabled={unBindingStatus}
							onClick={handleOnUnBindEmail}>
							解绑
							{unBindingStatus && <Loader2 className='h-4 w-4 animate-spin' />}
						</Button>
					</div>
				</>
			)}
			<AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>注意</AlertDialogTitle>
						<AlertDialogDescription>
							解绑邮箱后，会自动删除密码，确认解绑吗？
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>取消</AlertDialogCancel>
						<AlertDialogAction onClick={handleUnBindEmail}>
							确认
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog
				open={showBindEmailDialogStatus}
				onOpenChange={setShowBindEmailDialogStatus}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>绑定邮箱</DialogTitle>
						<DialogDescription>
							绑定邮箱需发送验证码到邮箱，验证码正确才可修改。
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={onSubmitBindEmailForm} className='space-y-5'>
							<div className='grid gap-4'>
								<div className='grid gap-2'>
									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem>
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
												<div className='flex w-full items-center space-x-2'>
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
															<Loader2 className='h-4 w-4 animate-spin' />
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
							</div>
							<DialogFooter className='sm:justify-end'>
								<Button type='submit' disabled={submitFormStatus}>
									确认
									{submitFormStatus && (
										<Loader2 className='h-4 w-4 animate-spin' />
									)}
								</Button>
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
		</>
	);
};

export default EmailBind;
