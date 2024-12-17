'use client';

import { getTaskDetail } from '@/service/task';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const taskFormSchema = z.object({
	title: z.string().min(5).max(40),
	description: z.string().min(10).max(200),
	priority: z.number().min(0).max(5),
	status: z.string().min(0).max(50),
});

interface TaskDetail {
	title: string;
	description: string;
	create_time: string;
	update_time: string;
	priority: number;
	status: string;
}

const TaskDetailPage = () => {
	const searchParams = useSearchParams();
	const [task, setTask] = useState<TaskDetail | null>(null);

	// 1. Define your form.
	const form = useForm<z.infer<typeof taskFormSchema>>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {
			title: '',
			description: '',
			priority: 1,
			status: '',
		},
	});

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
		form.reset({
			title: res.title,
			description: res.description,
			priority: res.priority,
			status: res.status,
		});
	};

	const onSuccess = async (values: z.infer<typeof taskFormSchema>) => {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	};

	const onError = (errors: any) => {
		// Handle validation errors here.
		console.log(errors);
	};

	useEffect(() => {
		onGetTask();
	}, []);

	return (
		<div className='pb-5 flex-1 h-1 overflow-auto'>
			{task ? (
				<Card className='p-5'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSuccess, onError)}
							className='space-y-5'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex flex-col gap-2'>
											标题
											<FormDescription>
												起个爽快明了的名字更有利于行动起来哦
											</FormDescription>
										</FormLabel>
										<div className='flex flex-col gap-2'>
											<FormControl>
												<Input placeholder='标题' {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex flex-col gap-2'>
											详情
											<FormDescription>
												任务的详情也是很重要的，这里可以记载你真正的任务步骤。
											</FormDescription>
										</FormLabel>
										<div className='flex flex-col gap-2'>
											<FormControl>
												<Textarea placeholder='详情' {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='priority'
								render={({ field }) => (
									<FormItem className='flex justify-between items-center'>
										<FormLabel className='flex flex-col gap-2'>
											优先级
											<FormDescription>
												范围1-5，不得在这个范围之外。
											</FormDescription>
										</FormLabel>
										<div className='flex flex-col gap-2'>
											<FormControl>
												<Input
													type='number'
													placeholder='优先级'
													{...field}
													onChange={(e) => {
														// 将输入值转换为数字，防止字符串值影响验证
														if (Number(e.target.value)) {
															field.onChange(Number(e.target.value));
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='status'
								render={({ field }) => (
									<FormItem className='flex justify-between items-center'>
										<FormLabel className='flex flex-col gap-2'>
											状态
											<FormDescription>
												当前共有五种类型，分别具有不同含义，可以自行修改。
											</FormDescription>
										</FormLabel>
										<div className='flex flex-col gap-2'>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select a verified email to display' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='todo'>待做</SelectItem>
													<SelectItem value='doing'>进行中</SelectItem>
													<SelectItem value='done'>完成</SelectItem>
													<SelectItem value='canceled'>取消</SelectItem>
													<SelectItem value='failed'>失败</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<Button className='w-full' variant={'outline'} type='submit'>
								保存
							</Button>
						</form>
					</Form>
				</Card>
			) : (
				<>无对应数据</>
			)}
		</div>
	);
};

export default TaskDetailPage;
