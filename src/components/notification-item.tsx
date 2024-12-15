import { codeToHtml } from 'shiki';
import {
	CardDescription,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { useEffect, useState } from 'react';
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
	create_time: string;
	tasks: Task[];
}

interface Props {
	notification: Notification;
}

const NotificationItem = (props: Props) => {
	const router = useRouter();
	const { notification } = props;
	const [codeHtml, setCodeHtml] = useState<string>('');

	const onGetCode = async () => {
		const codeHtml = await codeToHtml(notification.custom_data, {
			lang: 'json',
			themes: {
				light: 'min-light',
				dark: 'min-dark',
			},
		});
		setCodeHtml(codeHtml);
	};

	useEffect(() => {
		onGetCode();
	}, []);

	return (
		<div
			className='flex flex-row items-center gap-5 w-full cursor-pointer'
			key={notification.id}
			onClick={() => {
				router.push(`/dashboard/notification/detail?id=${notification.id}`);
			}}>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>标题：{notification.title}</CardTitle>
					<p>副标题：{notification.subtitle}</p>
				</CardHeader>
				<CardContent className='flex flex-col gap-2'>
					<p>主体内容：{notification.body}</p>

					{notification.custom_data && (
						<Card>
							<CardHeader>
								<CardTitle>自定义体</CardTitle>
							</CardHeader>
							<CardContent>
								<p dangerouslySetInnerHTML={{ __html: codeHtml }} />
							</CardContent>
						</Card>
					)}

					{notification.tasks.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>任务队列</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex flex-col gap-2'>
									{notification.tasks.map((task, index) => {
										return (
											<div
												onClick={(e) => {
													e.stopPropagation(); // 阻止冒泡
													router.push(`/dashboard/task/detail?id=${task.id}`);
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
							</CardContent>
						</Card>
					)}
				</CardContent>
				<CardFooter>
					<CardDescription>
						触发时间：{notification.create_time}
					</CardDescription>
				</CardFooter>
			</Card>
		</div>
	);
};

export default NotificationItem;
