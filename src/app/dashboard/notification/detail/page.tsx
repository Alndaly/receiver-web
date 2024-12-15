'use client';

import { getNotificationDetail } from '@/service/notification';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Task {
	id: string;
	title: string;
	status: string;
	description: string;
	create_time: string;
	update_time: string;
}

interface NotificationDetail {
	id: number;
	title: string;
	subtitle: string;
	body: string;
	create_time: string;
	update_time: string;
	custom_data: string;
	tasks: Task[];
}

const NotificationDetailPage = () => {
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
		<div>
			{notification ? (
				<>
					<p>{notification.title}</p>
					<p>{notification.subtitle}</p>
					<p>{notification.body}</p>
				</>
			) : (
				<>无对应数据</>
			)}
		</div>
	);
};

export default NotificationDetailPage;
