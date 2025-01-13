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
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { bindPhoneCode, bindPhoneVerify, unBindPhone } from '@/service/user';
import { useUserStore } from '@/stores/user-store-provider';

const phoneFormSchema = z.object({
	phone: z.string().min(8).max(40),
	code: z.string().min(1).max(40),
});

const PhoneBind = () => {
	const { userInfo, refreshUserInfo } = useUserStore((state) => state);
	const [formSubmitStatus, setFormSubmitStatus] = useState(false);
	const [showPhoneBindFormDialog, setShowPhoneBindFormDialog] = useState(false);
	const defaultTime = 60;
	const [codeSendingStatus, setCodeSendingStatus] = useState<string | null>(
		null
	);
	const [countDownSeconds, setCountDownSeconds] = useState(defaultTime);

	const form = useForm<z.infer<typeof phoneFormSchema>>({
		resolver: zodResolver(phoneFormSchema),
		defaultValues: {
			phone: '',
			code: '',
		},
	});

	const onSubmitPhoneBindForm = async (
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
		values: z.infer<typeof phoneFormSchema>
	) => {
		setFormSubmitStatus(true);
		const [res, err] = await bindPhoneVerify(values.phone, values.code);
		if (err) {
			toast.error(err.message);
			setFormSubmitStatus(false);
			return;
		}
		toast.success('更新成功');
		setFormSubmitStatus(false);
		refreshUserInfo();
		setShowPhoneBindFormDialog(false);
	};

	const onFormValidateError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const onSendCode = async () => {
		setCodeSendingStatus('sending');
		const [res, err] = await bindPhoneCode(form.getValues('phone'));
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

	const handleUnBindPhone = async () => {
		const [res, err] = await unBindPhone();
		if (err) {
			toast.error(err.message);
			return;
		}
		toast.success('解绑成功');
		refreshUserInfo();
	};

	return (
		<>
			{!userInfo.phone_info && (
				<Button
					variant='outline'
					onClick={() => {
						setShowPhoneBindFormDialog(true);
					}}>
					绑定手机
				</Button>
			)}

			{userInfo.phone_info && (
				<div className='flex flex-row items-center'>
					<div className='font-bold text-xs'>{userInfo.phone_info.phone}</div>
					<Button
						variant={'link'}
						className='text-xs'
						onClick={handleUnBindPhone}>
						解绑
					</Button>
				</div>
			)}

			<Dialog
				open={showPhoneBindFormDialog}
				onOpenChange={setShowPhoneBindFormDialog}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>绑定手机</DialogTitle>
						<DialogDescription>
							绑定手机需发送验证码到手机，验证码正确才可修改。
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={onSubmitPhoneBindForm} className='space-y-5'>
							<div className='space-y-5'>
								<FormField
									control={form.control}
									name='phone'
									render={({ field }) => (
										<FormItem>
											<div className='flex flex-col gap-2'>
												<FormControl>
													<Input
														type='text'
														placeholder='请输入正确的手机号'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='code'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<div className='flex flex-row gap-2 flex-1 items-center w-full'>
												<FormControl className='flex-1'>
													<Input
														type='text'
														placeholder='请输入验证码'
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
	);
};

export default PhoneBind;
