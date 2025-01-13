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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { updatePassword, updatePasswordEmailCode } from '@/service/user';
import { useUserStore } from '@/stores/user-store-provider';

const passwordFormSchema = z.object({
	password: z.string().min(8).max(40),
	code: z.string().min(1).max(40),
});

const PassWordUpdate = () => {
	const [showPasswordUpdateForm, setShowPasswordUpdateForm] = useState(false);
	const [formSubmitStatus, setFormSubmitStatus] = useState<boolean>(false);
	const { userInfo, refreshUserInfo } = useUserStore((state) => state);
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

	const onSubmitUpdatePasswordForm = async (
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
		values: z.infer<typeof passwordFormSchema>
	) => {
		setFormSubmitStatus(true);
		const [res, err] = await updatePassword(values.password, values.code);
		if (err) {
			toast.error(err.message);
			setFormSubmitStatus(false);
			return;
		}
		toast.success('更新成功');
		setFormSubmitStatus(false);
		form.reset()
		refreshUserInfo();
		setShowPasswordUpdateForm(false);
	};

	const onFormValidateError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const onSendCode = async () => {
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
		<>
			{userInfo.email_info && (
				<>
					<Button
						variant='outline'
						onClick={() => {
							setShowPasswordUpdateForm(true);
						}}>
						{userInfo.email_info.has_password ? '更改密码' : '设置密码'}
					</Button>
					<Dialog
						open={showPasswordUpdateForm}
						onOpenChange={setShowPasswordUpdateForm}>
						<DialogContent className='sm:max-w-md'>
							<DialogHeader>
								<DialogTitle>
									{userInfo.email_info.has_password ? '更改密码' : '设置密码'}
								</DialogTitle>
								<DialogDescription>
									{userInfo.email_info.has_password ? '更改密码' : '设置密码'}
									需发送验证码到邮箱，验证码正确才可修改。
								</DialogDescription>
							</DialogHeader>
							<Form {...form}>
								<form
									onSubmit={onSubmitUpdatePasswordForm}
									className='space-y-5'>
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
														onClick={onSendCode}
														disabled={codeSendingStatus !== null}>
														{codeSendingStatus === 'sending' && (
															<Loader2 className='h-4 w-4 animate-spin' />
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
														输入{userInfo.email_info?.has_password ? '新' : ''}
														密码
														<FormDescription>不得少于8位</FormDescription>
													</FormLabel>
													<div className='flex flex-col gap-2'>
														<FormControl>
															<Input
																type='password'
																placeholder='密码'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>
									</div>
									<DialogFooter className='sm:justify-end'>
										<Button type='submit' disabled={formSubmitStatus}>
											确认
											{formSubmitStatus && (
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
			)}
		</>
	);
};

export default PassWordUpdate;
