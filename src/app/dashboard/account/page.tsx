'use client';

import PassWordUpdate from '@/components/password-update';
import { Card, CardContent } from '@/components/ui/card';
import { deleteUser, getMyInfo } from '@/service/user';
import { updateUserInfo } from '@/service/user';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user-store-provider';

interface UserInfo {
	nickname: string;
	email: string;
	avatar: string;
	enable_notify: boolean;
}

const userInfoFormSchema = z.object({
	nickname: z.string().min(1).max(40),
	email: z.string().email(),
	avatar: z.string().url(),
	enable_notify: z.boolean(),
});

const AccountPage = () => {
	const router = useRouter();
	const { userInfo, setUserInfo } = useUserStore((state) => state);
	const form = useForm<z.infer<typeof userInfoFormSchema>>({
		resolver: zodResolver(userInfoFormSchema),
		defaultValues: {
			avatar: '',
			nickname: '',
			email: '',
			enable_notify: false,
		},
	});

	const onGetUserInfo = async () => {
		const [res, err] = await getMyInfo();
		if (err) {
			toast.error(err.message);
			return;
		}
		setUserInfo(res.nickname, res.email, res.avatar);
		form.reset({
			nickname: res.nickname,
			email: res.email,
			avatar: res.avatar,
			enable_notify: res.enable_notify,
		});
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

	const onSuccess = async (values: z.infer<typeof userInfoFormSchema>) => {
		const [res, err] = await updateUserInfo(
			values.avatar,
			values.nickname,
			values.enable_notify
		);
		if (err) {
			toast.error(err.message);
			return;
		}
		toast.success('更新成功');
		const [res_new, err_new] = await getMyInfo();
		if (err) {
			toast.error(err.message);
			return;
		}
		setUserInfo(res_new.nickname, res_new.email, res_new.avatar);
	};

	const onError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const onDeleteUser = async () => {
		const [res, err] = await deleteUser();
		if (err) {
			toast.error(err.message);
			return;
		}
		toast.success('账号注销成功，即将退出并跳转到登录页面');
		Cookies.remove('access_token');
		Cookies.remove('refresh_token');
		router.push('/login');
	};

	useEffect(() => {
		onGetUserInfo();
	}, []);

	return (
		<div>
			{userInfo && (
				<>
					<Card className='p-5'>
						<Form {...form}>
							<form onSubmit={onSubmit} className='space-y-5'>
								<FormField
									control={form.control}
									name='nickname'
									render={({ field }) => (
										<FormItem className='flex justify-between items-center'>
											<FormLabel className='flex flex-col gap-2'>
												昵称
												<FormDescription>这可是你的昵称哦</FormDescription>
											</FormLabel>
											<div className='flex flex-col gap-2'>
												<FormControl>
													<Input placeholder='昵称' {...field} />
												</FormControl>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem className='flex justify-between items-center'>
											<FormLabel className='flex flex-col gap-2'>
												邮箱
												<FormDescription>可作为登录方式</FormDescription>
											</FormLabel>
											<div className='flex flex-col gap-2'>
												<FormControl>
													<Input disabled placeholder='昵称' {...field} />
												</FormControl>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
								<div className='flex justify-between items-center'>
									<FormLabel className='flex flex-col gap-2'>
										密码
										<FormDescription>如果是apple注册，那么初始密码是123456</FormDescription>
									</FormLabel>
									<div className='flex flex-col gap-2'>
										<PassWordUpdate />
									</div>
								</div>
								<FormField
									control={form.control}
									name='enable_notify'
									render={({ field }) => (
										<FormItem className='flex justify-between items-center'>
											<FormLabel className='flex flex-col gap-2'>
												通知许可
												<FormDescription>
													是否允许接受通知（此处可一键屏蔽所有ApiKey的通知）
												</FormDescription>
											</FormLabel>
											<div className='flex flex-col gap-2'>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
								<Button className='w-full' variant={'outline'} type='submit'>
									保存
								</Button>
							</form>
						</Form>
					</Card>
					<Card className='mt-5'>
						<CardContent className='pt-5'>
							<Button
								onClick={onDeleteUser}
								variant={'destructive'}
								className='w-full'>
								注销账号
							</Button>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
};

export default AccountPage;
