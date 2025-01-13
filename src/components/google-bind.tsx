import { toast } from 'sonner';
import { Button } from './ui/button';
import { unBindGoogle } from '@/service/user';
import { useUserStore } from '@/stores/user-store-provider';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const GoogleBind = () => {
	const [unBindStatus, setUnBindStatus] = useState(false);
	const { userInfo, refreshUserInfo } = useUserStore((state) => state);
	const handleBindGoogle = () => {
		// the client id from google
		const client_id =
			'417378210659-r3l1uobmi4f5vvfheip1rkh7njhhekrc.apps.googleusercontent.com';
		// redirect the user to google
		const link = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${window.location.origin}/integrations/google/oauth2/bind/callback&scope=openid email profile&response_type=code`;
		window.location.assign(link);
	};
	const handleUnBindGoogle = async () => {
		setUnBindStatus(true);
		const [res, err] = await unBindGoogle();
		if (err) {
			toast.error(err.message);
			setUnBindStatus(false);
			return;
		}
		toast.success('解绑成功');
		setUnBindStatus(false);
		refreshUserInfo();
	};
	return (
		<div>
			{userInfo.google_info && (
				<div className='flex flex-row items-center'>
					<div className='font-bold text-xs'>
						ID: {userInfo.google_info.google_id}
					</div>
					<Button
						variant={'link'}
						className='text-xs'
						disabled={unBindStatus}
						onClick={handleUnBindGoogle}>
						解绑
						{unBindStatus && <Loader2 className='h-4 w-4 animate-spin' />}
					</Button>
				</div>
			)}
			{!userInfo.google_info && (
				<Button onClick={handleBindGoogle} variant={'outline'}>
					前往绑定
				</Button>
			)}
		</div>
	);
};

export default GoogleBind;
