'use client';

import { bindGoogle } from '@/service/user';
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
		<div
			className='flex h-screen w-full items-center justify-center px-4'
			style={{
				backgroundImage: 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)',
			}}>
			授权成功，用户绑定中，绑定完成即会自动跳转，请稍作等候...
		</div>
	);
};

export default GoogleBindPage;
