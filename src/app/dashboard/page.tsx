'use client';

import NotificationSummary from '@/components/notification-summary';
import {
	Card,
	CardContent,
	CardTitle,
	CardFooter,
	CardHeader,
	CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { getTodayNotification } from '@/service/notification';
import { useEffect } from 'react';
import { useGetState } from 'ahooks';

interface TodayNotification {
	info: number;
	warning: number;
	error: number;
	null: number | null;
}

const DashboardPage = () => {
	const [todayNotification, setTodayNotification] =
		useGetState<TodayNotification | null>();

	const onGetTodayNotification = async () => {
		const [res, err] = await getTodayNotification();
		setTodayNotification(res);
	};

	useEffect(() => {
		onGetTodayNotification();
	}, []);

	return (
		<div>
			<Alert className='mb-5'>
				<Info className='h-4 w-4' />
				<AlertTitle>Heads up!</AlertTitle>
				<AlertDescription>
					此项目仍在开发中，部分功能还未完善，请稍候。若有问题请联系微信Kinda0412。
				</AlertDescription>
			</Alert>
			<div className='grid grid-cols-3 gap-5 mb-5'>
				<Card>
					<CardHeader>
						<CardTitle>今日消息</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayNotification?.info ?? 0}
						</span>
						条
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>今日警告</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayNotification?.warning ?? 0}
						</span>
						条
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>今日报错</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayNotification?.error ?? 0}
						</span>
						条
					</CardContent>
				</Card>
			</div>
			<NotificationSummary />
		</div>
	);
};

export default DashboardPage;
