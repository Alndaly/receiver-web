'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import PassWordUpdate from '@/components/password-update';
import { Card } from '@/components/ui/card';
import { getMyInfo } from '@/service/user';
import { updateUserInfo } from '@/service/user';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserInfo {
	nickname: string;
	email: string;
	avatar: string;
}

const userInfoFormSchema = z.object({
	nickname: z.string().min(1).max(40),
	email: z.string().email(),
	avatar: z.string().url(),
});

const AccountPage = () => {
	const form = useForm<z.infer<typeof userInfoFormSchema>>({
		resolver: zodResolver(userInfoFormSchema),
		defaultValues: {
			avatar: '',
			nickname: '',
			email: '',
		},
	});

	const [userInfo, setUserInfo] = useState<UserInfo | null>();

	const onGetUserInfo = async () => {
		const [res, err] = await getMyInfo();
		if (err) {
			toast.error(err.message);
			return;
		}
		setUserInfo(res);
		form.reset({
			nickname: res.nickname,
			email: res.email,
			avatar: res.avatar,
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
		const [res, err] = await updateUserInfo(values.avatar, values.nickname);
		if (err) {
			toast.error(err.message);
			return;
		}
		toast.success('更新成功');
	};

	const onError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	useEffect(() => {
		onGetUserInfo();
	}, []);

	return (
		<div>
			{userInfo && (
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
									<FormDescription>初识密码是123456</FormDescription>
								</FormLabel>
								<div className='flex flex-col gap-2'>
									<PassWordUpdate />
								</div>
							</div>
							<Button className='w-full' variant={'outline'} type='submit'>
								保存
							</Button>
						</form>
					</Form>
				</Card>
			)}
		</div>
	);
};

export default AccountPage;
