'use client';

import { createUserByGoogle } from '@/service/user';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { utils } from '@kinda/utils';

const GoogleCreatePage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const code = searchParams.get('code');

	const onCreateGoogleUser = async (code: string) => {
		const [res, err] = await createUserByGoogle(code);
		if (err) {
			toast.error(err.message);
			await utils.sleep(1000);
			router.push('/login');
			return;
		}
		Cookies.set('access_token', res.access_token, {
			expires: res.expires_in / 1000,
		});
		Cookies.set('refresh_token', res.refresh_token);
		router.push('/dashboard');
	};

	useEffect(() => {
		if (!code) {
			return;
		}
		onCreateGoogleUser(code);
	}, []);

	return (
		<div className='flex h-screen w-full items-center justify-center px-4'>
			授权成功，用户绑定中，绑定完成即会自动跳转，请稍作等候...
		</div>
	);
};

export default GoogleCreatePage;
