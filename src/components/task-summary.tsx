'use client';

import { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { getTaskSummary } from '@/service/task';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useGetState } from 'ahooks';
import { toast } from 'sonner';

const chartConfig = {
	'data.todo': {
		label: '待开始',
		color: 'hsl(var(--chart-1))',
	},
	'data.doing': {
		label: '进行中',
		color: 'hsl(var(--chart-2))',
	},
	'data.canceled': {
		label: '已取消',
		color: 'hsl(var(--chart-3))',
	},
	'data.failed': {
		label: '失败',
		color: 'hsl(var(--chart-4))',
	},
	'data.done': {
		label: '已完成',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

interface TaskSummaryItem {
	time: string;
	data: {
		doing: number;
		todo: number;
		canceled: number;
		failed: number;
		done: number;
	};
}

const TaskSummary = () => {
	const [chartData, setChartData] = useState<TaskSummaryItem[]>([]);
	const [timeRange, setTimeRange, getTimeRange] = useGetState('month');

	const onGetTaskSummary = async () => {
		const [res, err] = await getTaskSummary(getTimeRange());
		if (err) {
			toast.error(err.message);
			return;
		}
		setChartData(res.data);
	};

	useEffect(() => {
		onGetTaskSummary();
	}, [timeRange]);

	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>任务统计表</CardTitle>
					<CardDescription>
						这里可以查看特定时间单位内的任务完成情况
					</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger
						className='w-[160px] rounded-lg sm:ml-auto'
						aria-label='Select a value'>
						<SelectValue placeholder='当月' />
					</SelectTrigger>
					<SelectContent className='rounded-xl'>
						<SelectItem value='month' className='rounded-lg'>
							当月
						</SelectItem>
						<SelectItem value='week' className='rounded-lg'>
							当周
						</SelectItem>
						<SelectItem value='day' className='rounded-lg'>
							当天
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'>
					<AreaChart data={chartData} accessibilityLayer>
						<defs>
							<linearGradient id='fillCanceled' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.canceled'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.canceled'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id='fillDoing' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.doing'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.doing'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id='fillDone' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.done'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.done'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id='fillFailed' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.failed'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.failed'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id='fillTodo' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.todo'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.todo'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='time'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										if (timeRange === 'day') return value;
										return new Date(value).toLocaleDateString('zh-CN', {
											month: 'short',
											day: 'numeric',
										});
									}}
									indicator='dot'
								/>
							}
						/>
						<Area
							dataKey='data.canceled'
							type='natural'
							fill='url(#fillCanceled)'
							stroke={chartConfig['data.canceled'].color}
							stackId='a'
						/>
						<Area
							dataKey='data.doing'
							type='natural'
							fill='url(#fillDoing)'
							stroke={chartConfig['data.doing'].color}
							stackId='a'
						/>
						<Area
							dataKey='data.done'
							type='natural'
							fill='url(#fillDone)'
							stroke={chartConfig['data.done'].color}
							stackId='a'
						/>
						<Area
							dataKey='data.failed'
							type='natural'
							fill='url(#fillFailed)'
							stroke={chartConfig['data.failed'].color}
							stackId='a'
						/>
						<Area
							dataKey='data.todo'
							type='natural'
							fill='url(#fillTodo)'
							stroke={chartConfig['data.todo'].color}
							stackId='a'
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default TaskSummary;
