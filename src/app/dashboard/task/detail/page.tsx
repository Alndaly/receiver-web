'use client';

import { getTaskDetail } from '@/service/task';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface TaskDetail {
	title: string;
	description: string;
	create_time: string;
	update_time: string;
	status: string;
}

const TaskDetailPage = () => {
	const searchParams = useSearchParams();
	const [task, setTask] = useState<TaskDetail | null>(null);
	useEffect(() => {
		onGetTask();
	}, []);

	const onGetTask = async () => {
		const id = searchParams.get('id');
		if (!id) {
			toast.error('缺少id参数');
			return;
		}
		const [res, err] = await getTaskDetail(id);
		if (err) {
			toast.error(err.message);
			return;
		}
		setTask(res);
	};

	return (
		<div>
			{task ? (
				<>
					<p>{task.title}</p>
					<p>{task.description}</p>
				</>
			) : (
				<>无对应数据</>
			)}
		</div>
	);
};

export default TaskDetailPage;
