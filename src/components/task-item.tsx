import { useRouter } from 'next/navigation';
import { MoreHorizontal, AlarmClock, CircleCheckBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardTitle } from '@/components/ui/card';

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
	return (
		<div
			onClick={() => {
				router.push(`/dashboard/task/detail?id=${task.id}`);
			}}
			className='flex flex-row items-center gap-5 w-full cursor-pointer'
			key={task.id}>
			<Card className='w-full grid grid-cols-12 gap-2 px-3 py-2'>
				<CardTitle>{task.title}</CardTitle>
				<p className='flex items-center col-span-2'></p>
				<p className='flex items-center col-span-5'>{task.description}</p>
				<p className='flex items-center col-span-2'>{task.priority}</p>
				<p className='flex items-center col-span-2'>
					{task.start_time}
					{task.expire_time}
				</p>
				<p className='flex items-center col-span-1'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={() => console.log(111)}>
								删除
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</p>
			</Card>
		</div>
	);
};

export default TaskItem;
