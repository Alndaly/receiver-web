'use client';

import PassWordUpdate from '@/components/password-update';
import { Card, CardContent } from '@/components/ui/card';
import { deleteUser, getMyInfo, updateUserEnableNotify } from '@/service/user';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user-store-provider';
import { Label } from '@/components/ui/label';
import GitHubBind from '@/components/github-bind';
import GoogleBind from '@/components/google-bind';
import PhoneBind from '@/components/phone-bind';
import { Separator } from '@/components/ui/separator';
import EmailBind from '@/components/email-bind';
import { Loader2 } from 'lucide-react';
import AvatarUpdate from '@/components/avatar-update';
import NicknameUpdate from '@/components/nickname-update';

const userInfoFormSchema = z.object({
	nickname: z.string().min(1).max(40),
});

const AccountPage = () => {
	const router = useRouter();
	const [deleteUserSubmitStatus, setDeleteUserSubmitStatus] = useState(false);
	const { userInfo, setUserInfo } = useUserStore((state) => state);
	const form = useForm<z.infer<typeof userInfoFormSchema>>({
		resolver: zodResolver(userInfoFormSchema),
		defaultValues: {
			nickname: '',
		},
	});

	const onGetUserInfo = async () => {
		const [res, err] = await getMyInfo();
		if (err) {
			toast.error(err.message);
			return;
		}
		setUserInfo(res);
		form.reset({
			nickname: res.nickname,
		});
	};

	const onDeleteUser = async () => {
		setDeleteUserSubmitStatus(true);
		const [res, err] = await deleteUser();
		if (err) {
			toast.error(err.message);
			setDeleteUserSubmitStatus(false);
			return;
		}
		toast.success('账号注销成功，即将退出并跳转到登录页面');
		setDeleteUserSubmitStatus(false);
		Cookies.remove('access_token');
		Cookies.remove('refresh_token');
		router.push('/login');
	};

	const handleEnableNotifyChange = async (value: boolean) => {
		setUserInfo({ ...userInfo, enable_notify: value });
		const [res, err] = await updateUserEnableNotify(value);
		if (err) {
			toast.error(err.message);
		}
		await onGetUserInfo();
	};

	useEffect(() => {
		onGetUserInfo();
	}, []);

	return (
		<div className='flex flex-col px-5 pb-5'>
			{userInfo && (
				<>
					<Card>
						<CardContent className='pt-5 space-y-5'>
							<div className='flex justify-between items-center'>
								<Label className='flex flex-col gap-2'>
									头像
									<div className='text-[0.8rem] text-muted-foreground'>
										这可是你的头像哦
									</div>
								</Label>
								<div className='flex flex-col gap-2'>
									<AvatarUpdate />
								</div>
							</div>
							<Separator />
							<div className='flex justify-between items-center'>
								<Label className='flex flex-col gap-2'>
									昵称
									<div className='text-[0.8rem] text-muted-foreground'>
										这可是你的昵称哦
									</div>
								</Label>
								<div className='flex flex-col gap-2'>
									<NicknameUpdate />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='mt-5'>
						<CardContent className='pt-5 space-y-5'>
							<div className='flex justify-between items-center'>
								<Label className='flex flex-col gap-2'>
									邮箱
									<div className='text-[0.8rem] text-muted-foreground'>
										可作为登录方式
									</div>
								</Label>
								<div className='flex flex-col gap-2'>
									<EmailBind />
								</div>
							</div>
							{userInfo.email_info && (
								<>
									<Separator />
									<div className='flex justify-between items-center'>
										<Label className='flex flex-col gap-2'>
											密码
											<div className='text-[0.8rem] text-muted-foreground'>
												可通过邮箱+密码的方式登录账号
											</div>
										</Label>
										<div className='flex flex-col gap-2'>
											<PassWordUpdate />
										</div>
									</div>
								</>
							)}
							<Separator />
							<div className='flex justify-between items-center'>
								<Label className='flex flex-col gap-2'>
									手机号
									<div className='text-[0.8rem] text-muted-foreground'>
										绑定手机号后，即可通过手机号快速登录此账号
									</div>
								</Label>
								<div className='flex flex-col gap-2'>
									<PhoneBind />
								</div>
							</div>
							<Separator />
							<div className='flex justify-between items-center'>
								<Label className='flex flex-col gap-2'>
									GitHub
									<div className='text-[0.8rem] text-muted-foreground'>
										绑定GitHub账号后，即可通过GitHub账号快速登录此账号
									</div>
								</Label>
								<div className='flex flex-col gap-2'>
									<GitHubBind />
								</div>
							</div>
							<Separator />
							<div className='flex justify-between items-center'>
								<Label className='flex flex-col gap-2'>
									Google
									<div className='text-[0.8rem] text-muted-foreground'>
										绑定Google账号后，即可通过Google账号快速登录此账号
									</div>
								</Label>
								<div className='flex flex-col gap-2'>
									<GoogleBind />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='mt-5'>
						<CardContent className='pt-5'>
							<div className='flex justify-between items-center'>
								<Label className='flex flex-col gap-2'>
									通知许可
									<div className='text-[0.8rem] text-muted-foreground'>
										是否允许接受通知（此处可一键屏蔽所有ApiKey的通知）
									</div>
								</Label>
								<div className='flex flex-col gap-2'>
									<Switch
										checked={userInfo.enable_notify}
										onCheckedChange={handleEnableNotifyChange}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='mt-5'>
						<CardContent className='pt-5'>
							<Button
								onClick={onDeleteUser}
								variant={'destructive'}
								disabled={deleteUserSubmitStatus}
								className='w-full'>
								注销账号
								{deleteUserSubmitStatus && (
									<Loader2 className='h-4 w-4 animate-spin' />
								)}
							</Button>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
};

export default AccountPage;
