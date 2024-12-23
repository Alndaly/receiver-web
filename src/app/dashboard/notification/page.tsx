'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchNotification } from '@/service/notification';
import { useEffect, useRef, useState } from 'react';
import { useGetState } from 'ahooks';
import { toast } from 'sonner';
import NotificationItem from '@/components/notification-item';
import { PaginationData } from '@/schemas/pagination';

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
	category: string;
	create_time: string;
	sender_avatar: string;
	cover: string;
	tasks: Task[];
}

const NotificationPage = () => {
	const bottomAnchorRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const [loading, setLoading, getLoading] = useGetState(false);
	const [pageNum, setPageNum, getPageNum] = useGetState(0);
	const [pageSize, setPageSize, getPageSize] = useGetState(10);
	const [keyword, setKeyword] = useState('');
	const [data, setData] = useState<PaginationData<Notification> | null>(null);

	const onSearchNotification = async (keyword: string) => {
		setLoading(true);
		setData(null);
		setPageNum(1);
		const [res, err] = await searchNotification(
			keyword,
			getPageNum(),
			pageSize
		);
		if (err) {
			toast.error(err.message);
			setLoading(false);
			return;
		}
		setData(res);
		setLoading(false);
	};

	const onGetNextPage = async () => {
		if (!getLoading()) {
			console.log('当前未在加载，获取下一页');
			setLoading(true);
			const [res, err] = await searchNotification(
				keyword,
				getPageNum() + 1,
				pageSize
			);
			if (err) {
				toast.error(err.message);
				return;
			}
			setData((prev) => {
				if (!prev) return res;
				return {
					...prev,
					elements: [...prev.elements, ...res.elements],
					current_page_elements: res.current_page_elements,
				};
			});
			if (!res.current_page_elements) {
				setLoading(false);
				return;
			}
			setPageNum((prev) => prev + 1);
			setLoading(false);
		} else {
			console.log('当前加载中，不获取');
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		const bottomAnchor = bottomAnchorRef.current;

		if (!container || !bottomAnchor) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					onGetNextPage();
				}
			},
			{
				root: container, // 滚动容器
				rootMargin: '0px',
				threshold: 1.0, // 完全可见时触发
			}
		);

		observer.observe(bottomAnchor);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		// 此处的h-1是为了给父级一个虚假的高度，否则子元素overflow-auto无效
		<div className='flex flex-col flex-1 h-1' ref={containerRef}>
			<div className='flex flex-row items-center gap-5'>
				<Input
					placeholder='输入通知关键词'
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
				/>
				<Button type='submit' onClick={() => onSearchNotification(keyword)}>
					搜索
				</Button>
			</div>
			<div className='flex flex-col flex-1 gap-5 mt-5 w-full overflow-auto pb-5'>
				{data?.total_elements === 0 && !loading && (
					<div className='text-center w-full'>暂无相关数据</div>
				)}
				{data &&
					data.elements.map((item, index) => {
						return (
							<div key={item.id}>
								<NotificationItem notification={item} />
							</div>
						);
					})}
				{loading && <div className='text-center w-full'>loading...</div>}
				{/* 底部添加一个锚点元素用来判断是否滑到底 */}
				<div ref={bottomAnchorRef}></div>
			</div>
		</div>
	);
};

export default NotificationPage;
