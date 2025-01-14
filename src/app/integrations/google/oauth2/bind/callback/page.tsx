'use client';

import { bindGoogle } from '@/service/user';
import { utils } from '@kinda/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const GoogleBindPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const code = searchParams.get('code');

	const onBindGoogleUser = async (code: string) => {
		const [res, err] = await bindGoogle(code);
		if (err) {
			toast.error(err.message);
			await utils.sleep(1000);
			router.push('/dashboard/account');
			return;
		}
		router.push('/dashboard/account');
	};

	useEffect(() => {
		if (!code) {
			return;
		}
		onBindGoogleUser(code);
	}, []);

	return (
		<div className='flex h-screen w-full items-center justify-center px-4'>
			授权成功，用户绑定中，绑定完成即会自动跳转，请稍作等候...
		</div>
	);
};

export default GoogleBindPage;
