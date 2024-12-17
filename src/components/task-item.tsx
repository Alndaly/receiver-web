import { useRouter } from 'next/navigation';
import {
	CircleCheckBig,
	Circle,
	CircleOff,
	CircleX,
	Timer,
	Flag,
	Clock5,
	Clock2,
} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { updateTask } from '@/service/task';
import { toast } from 'sonner';

interface Task {
	id: string;
	title: string;
	description: string;
	create_time: string;
	update_time: string;
	status: string;
	priority: string;
	start_time: string;
	expire_time: string;
}

interface TaskItemProps {
	task: Task;
}

const TaskItem = (props: TaskItemProps) => {
	const { task } = props;
	const router = useRouter();

	const onUpdateTaskStatus = async (status: string) => {
		const [res, err] = await updateTask(
			task.id,
			task.title,
			task.description,
			status
		);
		if (err) {
			toast.error(err.message);
			return;
		}
	};
	return (
		<Card>
			<div className='flex flex-row items-center justify-between border-b'>
				<div>
					<CardHeader className='flex flex-row gap-5 items-center'>
						<CardTitle className='flex flex-col'>
							<p className='mb-2'>{task.title}</p>
							<div className='flex flex-row gap-2 items-center'>
								<div className='flex items-center gap-1'>
									<Clock2 size='12' />
									<p className='font-normal text-xs'>{task.start_time}</p>
								</div>
								<div className='flex items-center gap-1'>
									<Clock5 size='12' />
									<p className='font-normal text-xs'>{task.expire_time}</p>
								</div>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='flex items-center col-span-5'>{task.description}</p>
					</CardContent>
				</div>
				<div className='flex flex-row gap-1 items-center p-5'>
					{Array.from({ length: Number(task.priority) }).map((_, index) => (
						<Flag key={index} />
					))}
				</div>
			</div>
			<CardFooter className='pt-5 flex flex-row items-center justify-between gap-5'>
				<Select
					onValueChange={(value) => {
						onUpdateTaskStatus(value);
					}}
					defaultValue={task.status}>
					<SelectTrigger className='w-[120px] shadow-none'>
						<SelectValue placeholder='Status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='done'>完成</SelectItem>
						<SelectItem value='todo'>待做</SelectItem>
						<SelectItem value='doing'>进行中</SelectItem>
						<SelectItem value='canceled'>已取消</SelectItem>
						<SelectItem value='failed'>失败</SelectItem>
					</SelectContent>
				</Select>
				<Button
					variant='outline'
					onClick={() => {
						router.push(`/dashboard/task/detail?id=${task.id}`);
					}}>
					查看任务详情
				</Button>
			</CardFooter>
		</Card>
	);
};

export default TaskItem;