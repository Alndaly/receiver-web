'use client';

import { initOSSClient, uploadFileToOSS } from '@/service/oss';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ImageUpload = () => {
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
		const [res, err] = await uploadFileToOSS(ossClient, fileName, file);
		if (err) {
			toast.error('上传失败');
			setUploadingStatus(false);
			return;
		}
		toast.success('上传成功');
		setUploadingStatus(false);
	};

	return (
		<>
			<Button onClick={onChooseFile} disabled={uploadingStatus}>
				{uploadingStatus && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
				上传文件
			</Button>
			<input
				type='file'
				className='hidden'
				ref={fileInput}
				onChange={onUpload}
			/>
		</>
	);
};

export default ImageUpload;
