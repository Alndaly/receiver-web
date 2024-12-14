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
import { getNotificationSummary } from '@/service/notification';
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

const chartConfig = {
	'data.info': {
		label: '提醒',
		color: 'hsl(var(--chart-1))',
	},
	'data.warning': {
		label: '警告',
		color: 'hsl(var(--chart-2))',
	},
	'data.error': {
		label: '错误',
		color: 'hsl(var(--chart-3))',
	},
	'data.null': {
		label: '未知类型',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

interface NotificationSummaryItem {
	time: string;
	data: {
		info: number;
		warning: number;
		error: number;
	};
}

const NotificationSummary = () => {
	const [chartData, setChartData] = useState<NotificationSummaryItem[]>([]);
	const [timeRange, setTimeRange, getTimeRange] = useGetState('month');

	const onGetNotificationSummary = async () => {
		const [res, err] = await getNotificationSummary(getTimeRange());
		setChartData(res);
	};

	useEffect(() => {
		onGetNotificationSummary();
	}, [timeRange]);

	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>通知统计表</CardTitle>
					<CardDescription>这里可以查看特定时间单位内的通知量</CardDescription>
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
							<linearGradient id='fillInfo' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.info'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.info'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id='fillWarning' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.warning'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.warning'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id='fillError' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.error'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.error'].color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id='fillNull' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor={chartConfig['data.null'].color}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={chartConfig['data.null'].color}
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
							dataKey='data.info'
							type='natural'
							fill='url(#fillInfo)'
							stroke={chartConfig['data.info'].color}
							stackId='a'
						/>
						<Area
							dataKey='data.warning'
							type='natural'
							fill='url(#fillWarning)'
							stroke={chartConfig['data.warning'].color}
							stackId='a'
						/>
						<Area
							dataKey='data.error'
							type='natural'
							fill='url(#fillError)'
							stroke={chartConfig['data.error'].color}
							stackId='a'
						/>
						<Area
							dataKey='data.null'
							type='natural'
							fill='url(#fillNull)'
							stroke={chartConfig['data.null'].color}
							stackId='a'
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default NotificationSummary;
