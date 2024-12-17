'use client';

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
import { getNotificationDetail } from '@/service/notification';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
	Circle,
	CircleCheckBig,
	CircleOff,
	CircleX,
	Clock5,
	Timer,
} from 'lucide-react';

interface Task {
	id: string;
	title: string;
	status: string;
	description: string;
	create_time: string;
	update_time: string;
	start_time: string;
	expire_time: string;
}

interface NotificationDetail {
	id: number;
	title: string;
	category: string;
	cover: string;
	sender_avatar: string;
	subtitle: string;
	body: string;
	create_time: string;
	update_time: string;
	custom_data: string;
	tasks: Task[];
}

const NotificationDetailPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [notification, setNotification] = useState<NotificationDetail | null>();

	useEffect(() => {
		onGetNotification();
	}, []);

	const onGetNotification = async () => {
		const id = searchParams.get('id');
		if (!id) {
			toast.error('缺少id参数');
			return;
		}
		const [res, err] = await getNotificationDetail(id);
		if (err) {
			toast.error(err.message);
			return;
		}
		setNotification(res);
	};

	return (
		<div className='pb-5 flex-1 h-1 overflow-auto'>
			{notification ? (
				<Card className='w-full'>
					<div className='flex flex-row items-center justify-between gap-5 w-full border-b'>
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
							<p>{notification.subtitle}</p>

							<p className='text-sm text-muted-foreground'>
								{notification.create_time}
							</p>
						</CardHeader>
						{notification.sender_avatar && (
							<div className='p-5'>
								<PhotoProvider>
									<PhotoView src={notification.sender_avatar}>
										<img
											src={notification.sender_avatar}
											className='rounded w-16 h-16'
											alt='avatar'
										/>
									</PhotoView>
								</PhotoProvider>
							</div>
						)}
					</div>
					<CardContent className='flex flex-col border-b pt-5 gap-5'>
						<p>{notification.body}</p>
						{notification.cover && (
							<PhotoProvider>
								<PhotoView src={notification.cover}>
									<img
										src={notification.cover}
										className='object-cover rounded'
										alt='cover'
									/>
								</PhotoView>
							</PhotoProvider>
						)}
					</CardContent>

					{notification.tasks.length > 0 && (
						<CardFooter>
							<div className='pt-6 flex flex-row items-center justify-between gap-5 w-full'>
								<div className='flex flex-row gap-5 items-center w-full'>
									<div className='flex flex-col gap-2 w-full'>
										{notification.tasks.map((task, index) => {
											return (
												<div
													onClick={(e) => {
														e.stopPropagation(); // 阻止冒泡
														router.push(`/dashboard/task/detail?id=${task.id}`);
													}}
													key={task.id}
													className='w-full rounded p-2 grid grid-cols-12 gap-5 items-center ring-1 ring-gray-200 cursor-pointer'>
													<div className='col-span-2 font-bold flex flex-row gap-2 items-center'>
														<Badge variant={'secondary'}>
															<div className='flex flex-row gap-2 items-center'>
																{task.status === 'done' && (
																	<CircleCheckBig size={15} />
																)}
																{task.status === 'todo' && <Circle size={15} />}
																{task.status === 'doing' && <Timer size={15} />}
																{task.status === 'canceled' && (
																	<CircleOff size={15} />
																)}
																{task.status === 'failed' && (
																	<CircleX size={15} />
																)}
															</div>
														</Badge>
														{task.title}
													</div>
													<p className='col-span-6'>{task.description}</p>
													<div className='flex items-center gap-2 text-sm col-span-4 justify-center'>
														<Clock5 size='15' />
														<p>
															{task.start_time}
															{' - '}
															{task.expire_time}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</CardFooter>
					)}
				</Card>
			) : (
				<>无对应数据</>
			)}
		</div>
	);
};

export default NotificationDetailPage;
