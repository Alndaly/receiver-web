import { useUserStore } from '@/stores/user-store-provider';
import { toast } from 'sonner';
import { initOSSClient, uploadFileToOSS } from '@/service/oss';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { createAttachment } from '@/service/attachment';
import { updateAvatar } from '@/service/user';

const AvatarUpdate = () => {
	const { userInfo, refreshUserInfo } = useUserStore((state) => state);
	const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);
	const fileInput = useRef<HTMLInputElement>(null);

	const onChooseFile = async () => {
		fileInput.current?.click();
	};

	const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingStatus(true);
		const ossClient = await initOSSClient();
		if (!ossClient) {
			toast.error('上传失败');
			setUploadingStatus(false);
			return;
		}
		const name = crypto.randomUUID();
		const suffix = file.name.split('.').pop();
		const fileName = `images/${name}.${suffix}`;
		const [res_upload, err_upload] = await uploadFileToOSS(
			ossClient,
			fileName,
			file
		);
		if (err_upload) {
			toast.error('上传失败');
			setUploadingStatus(false);
			return;
		}
		const [res_create_attachment, err_create_attachment] =
			await createAttachment(fileName, '头像');
		if (err_create_attachment) {
			toast.error('上传失败');
			setUploadingStatus(false);
			return;
		}
		const [res_update_avatar, err_update_avatar] = await updateAvatar(
			res_create_attachment.id
		);
		if (err_update_avatar) {
			toast.error('头像更新失败');
			setUploadingStatus(false);
			return;
		}
		toast.success('上传成功');
		setUploadingStatus(false);
		refreshUserInfo();
	};

	return (
		<>
			{userInfo.avatar && (
				<>
					<div className='flex flex-row'>
						<img
							src={userInfo.avatar}
							className='mr-2 h-8 w-8 rounded'
							alt={'avatar'}
						/>
						<Button
							className='text-xs'
							variant={'link'}
							onClick={onChooseFile}
							disabled={uploadingStatus}>
							{uploadingStatus && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							更改头像
						</Button>
					</div>
					<input
						type='file'
						className='hidden'
						ref={fileInput}
						onChange={onUpload}
					/>
				</>
			)}
		</>
	);
};

export default AvatarUpdate;
