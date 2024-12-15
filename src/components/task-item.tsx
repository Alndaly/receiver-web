import { useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface Task {
    id: string;
	title: string;
	description: string;
	create_time: string;
	update_time: string;
	status: string;
}

interface TaskItemProps {
	task: Task;
}

const TaskItem = (props: TaskItemProps) => {
	const { task } = props;
	const router = useRouter();
	return (
		<div
			onClick={() => {
				console.log(111);
				router.push(`/dashboard/task/detail?id=${task.id}`);
			}}
			className='flex flex-row items-center gap-5 w-full cursor-pointer'
			key={task.id}>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>ID：{task.id}</CardTitle>
					<CardTitle>标题：{task.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>主体内容：{task.description}</p>
				</CardContent>
				<CardFooter>
					<CardDescription>触发时间：{task.create_time}</CardDescription>
				</CardFooter>
			</Card>
		</div>
	);
};

export default TaskItem;
