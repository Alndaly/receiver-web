import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Task {
	id: string;
	title: string;
	status: string;
	description: string;
	create_time: string;
	update_time: string;
}

interface Notification {
	id: string;
	title: string;
	subtitle: string;
	body: string;
	custom_data: string;
	category: string;
	create_time: string;
	sender_avatar: string;
	cover: string;
	tasks: Task[];
}

interface Props {
	notification: Notification;
}

const NotificationItem = (props: Props) => {
	const router = useRouter();
	const { notification } = props;

	return (
		<div className='flex flex-row items-center gap-5 w-full'>
			<Card className='w-full'>
				<div className='flex flex-row border-b'>
					<div className='flex-1'>
						<CardHeader>
							<CardTitle className='flex flex-row items-center gap-2'>
								{notification.title}
								{notification.category === 'info' && (
									<Badge>{notification.category}</Badge>
								)}
								{notification.category === 'warning' && (
									<Badge variant='secondary'>{notification.category}</Badge>
								)}
								{notification.category === 'error' && (
									<Badge variant='destructive'>{notification.category}</Badge>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent className='flex flex-col'>
							<p>{notification.body}</p>
						</CardContent>
					</div>
					{notification.cover && (
						<div className='p-5 flex justify-center items-center'>
							<PhotoProvider>
								<PhotoView src={notification.cover}>
									<img
										src={notification.cover}
										className='w-20 h-20 object-cover rounded'
										alt='cover'
									/>
								</PhotoView>
							</PhotoProvider>
						</div>
					)}
				</div>
				<CardFooter>
					<div className='pt-6 flex flex-row items-center justify-between gap-5 w-full'>
						<div className='flex flex-row gap-5 items-center'>
							<Button
								variant='outline'
								onClick={() => {
									router.push(
										`/dashboard/notification/detail?id=${notification.id}`
									);
								}}>
								查看通知详情
							</Button>
							{notification.tasks.length > 0 && (
								<Popover>
									<PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
										<Button variant='outline'>查看关联任务</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div className='flex flex-col gap-2'>
											{notification.tasks.map((task, index) => {
												return (
													<div
														onClick={(e) => {
															e.stopPropagation(); // 阻止冒泡
															router.push(
																`/dashboard/task/detail?id=${task.id}`
															);
														}}
														key={task.id}
														className='rounded p-2 flex flex-row gap-5 items-center'>
														<p>{task.id}</p>
														<p>{task.title}</p>
														<p>{task.description}</p>
														<p>{task.status}</p>
													</div>
												);
											})}
										</div>
									</PopoverContent>
								</Popover>
							)}
						</div>
						<div className='flex flex-row items-center gap-2'>
							{notification.sender_avatar && (
								<PhotoProvider>
									<PhotoView src={notification.sender_avatar}>
										<img
											src={notification.sender_avatar}
											className='rounded-full w-6 h-6'
											alt='avatar'
										/>
									</PhotoView>
								</PhotoProvider>
							)}
							<p className='text-sm text-muted-foreground'>
								{notification.create_time}
							</p>
						</div>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default NotificationItem;
