import { DeviceTable } from '@/components/device-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Device = () => {
	return (
		<div className='px-5'>
			<Alert className='mb-5'>
				<Info className='h-4 w-4' />
				<AlertTitle>提醒</AlertTitle>
				<AlertDescription>
				考虑到业务逻辑，此处不支持删除设备，当你在对应设备端登录时候，会自动绑定设备；对应的，注销账户或者退出的时候，设备会自动同步删除。
				</AlertDescription>
			</Alert>
			<DeviceTable />
		</div>
	);
};

export default Device;
