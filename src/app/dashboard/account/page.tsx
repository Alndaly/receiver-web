'use client';

import { getMyInfo } from '@/service/user';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UserInfo {
	nickname: string;
	email: string;
	avatar: string;
}

const AccountPage = () => {
	const [userInfo, setUserInfo] = useState<UserInfo | null>();

	const onGetUserInfo = async () => {
		const [res, err] = await getMyInfo();
		if (err) {
			toast.error(err.message);
			return;
		}
		setUserInfo(res);
	};

	useEffect(() => {
		onGetUserInfo();
	}, []);

	return (
		<div className='py-5'>
			{userInfo && (
				<div className='flex flex-col gap-5'>
					<div className='flex flex-row gap-5 items-center'>
						<div className='font-bold'>头像</div>
						<Avatar className='w-24 h-24'>
							<AvatarImage src={userInfo.avatar} alt={userInfo.nickname} />
							<AvatarFallback>Avatar</AvatarFallback>
						</Avatar>
					</div>
					<div className='flex flex-row gap-5 items-center'>
						<div className='font-bold'>昵称</div>
						<div>{userInfo.nickname}</div>
					</div>
					<div className='flex flex-row gap-5 items-center'>
						<div className='font-bold'>邮箱</div>
						<div>{userInfo.email}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AccountPage;
