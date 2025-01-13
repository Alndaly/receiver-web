import { unBindGitHub } from '@/service/user';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/user-store-provider';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const GitHubBind = () => {
	const [unBindStatus, setUnBindStatus] = useState(false);
	const { userInfo, refreshUserInfo } = useUserStore((state) => state);
	const handleBindGitHub = () => {
		// the client id from github
		const client_id = 'Iv23liJSg8YL7I1GVbJ8';
		// redirect the user to github
		const link = `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${window.location.origin}/integrations/github/oauth2/bind/callback`;
		window.location.assign(link);
	};
	const handleUnBindGitHub = async () => {
		setUnBindStatus(true);
		const [res, err] = await unBindGitHub();
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
			{userInfo.github_info && (
				<div className='flex flex-row items-center'>
					<div className='font-bold text-xs'>
						ID: {userInfo.github_info.github_id}
					</div>
					<Button
						variant={'link'}
						className='text-xs'
						disabled={unBindStatus}
						onClick={handleUnBindGitHub}>
						解绑
						{unBindStatus && <Loader2 className='h-4 w-4 animate-spin' />}
					</Button>
				</div>
			)}

			{!userInfo.github_info && (
				<Button onClick={handleBindGitHub} variant={'outline'}>
					前往绑定
				</Button>
			)}
		</div>
	);
};

export default GitHubBind;
