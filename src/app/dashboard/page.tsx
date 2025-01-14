'use client';

import NotificationSummary from '@/components/notification-summary';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { getTodayNotification } from '@/service/notification';
import { getTodayTask } from '@/service/task';
import { useEffect } from 'react';
import { useGetState } from 'ahooks';
import TaskSummary from '@/components/task-summary';

interface TodayNotification {
	info: number;
	warning: number;
	error: number;
	null: number | null;
}

interface TodayTask {
	todo: number;
	done: number;
	doing: number;
	failed: number;
	canceled: number;
}

const DashboardPage = () => {
	const [todayNotification, setTodayNotification] =
		useGetState<TodayNotification | null>();
	const [todayTask, setTodayTask] = useGetState<TodayTask | null>();

	const onGetTodayNotification = async () => {
		const [res, err] = await getTodayNotification();
		setTodayNotification(res);
	};

	const onGetTodayTask = async () => {
		const [res, err] = await getTodayTask();
		setTodayTask(res);
	};

	useEffect(() => {
		onGetTodayNotification();
		onGetTodayTask();
	}, []);

	return (
		<div className='flex overflow-auto flex-col px-5' style={{flex: '1 1 0'}}>
			<Alert className='mb-5'>
				<Info className='h-4 w-4' />
				<AlertTitle>注意</AlertTitle>
				<AlertDescription>
					此项目仍在开发中，部分功能还未完善，请稍候。若有问题请联系微信Kinda0412。
				</AlertDescription>
			</Alert>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-5'>
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
			{/* <div className='grid grid-cols-5 gap-5 mb-5'>
				<Card>
					<CardHeader>
						<CardTitle>待做的任务</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayTask?.todo ?? 0}
						</span>
						条
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>在做的任务</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayTask?.doing ?? 0}
						</span>
						条
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>已取消任务</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayTask?.canceled ?? 0}
						</span>
						条
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>已完成任务</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayTask?.done ?? 0}
						</span>
						条
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>已失败任务</CardTitle>
					</CardHeader>
					<CardContent>
						累计
						<span className='font-bold px-2 text-2xl'>
							{todayTask?.failed ?? 0}
						</span>
						条
					</CardContent>
				</Card>
			</div> */}
			<div className='mb-5'>
				<NotificationSummary />
			</div>
			{/* <div className='mb-5'>
				<TaskSummary />
			</div> */}
		</div>
	);
};

export default DashboardPage;
