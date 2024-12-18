import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface DeviceItemProps {
	device: Device;
}

interface Device {
	id: number;
	device_name: string;
	os_system: string;
	system_version: string;
	ios_info: {
		device_token: string;
	};
}

const DeviceItem = (props: DeviceItemProps) => {
	const { device } = props;
	console.log(device);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{device.device_name}</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-2'>
				<p>系统：{device.os_system}</p>
				<p>版本：{device.system_version}</p>
			</CardContent>
			<CardFooter>
				<Popover>
					<PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
						<Button variant='outline'>查看设备token</Button>
					</PopoverTrigger>
					<PopoverContent className='w-fit overflow-auto p-2'>
						{device.ios_info.device_token}
					</PopoverContent>
				</Popover>
			</CardFooter>
		</Card>
	);
};
export default DeviceItem;
