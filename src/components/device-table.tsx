'use client';

import { useEffect, useState } from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	RowSelectionState,
} from '@tanstack/react-table';
import _ from 'lodash';
import { BookOpen, Copy, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { searchDevice, deleteDevices, getDeviceDetail } from '@/service/device';
import { DialogDescription } from '@radix-ui/react-dialog';
import { PaginationData } from '@/schemas/pagination';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Input } from './ui/input';

export type Device = {
	id: string;
	device_name: string;
	os_system: string;
	system_version: string;
	ios_info?: any;
};

export function DeviceTable() {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [showDeviceDetail, setShowDeviceDetail] = useState(false);
	const [data, setData] = useState<PaginationData<Device> | null>(null);
	const [pagination, setPagination] = useState({
		pageIndex: 1, //initial page index
		pageSize: 10, //default page size
	});
	const [deviceDetail, setDeviceDetail] = useState<Device | null>(null);

	const columns: ColumnDef<Device>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Select all'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label='Select row'
				/>
			),
		},
		{
			accessorKey: 'id',
			header: 'ID',
			cell: ({ row }) => <div>{row.getValue('id')}</div>,
		},
		{
			accessorKey: 'device_name',
			header: '设备名称',
			cell: ({ row }) => <div>{row.getValue('device_name')}</div>,
		},
		{
			accessorKey: 'os_system',
			header: '设备系统',
			cell: ({ row }) => <div>{row.getValue('os_system')}</div>,
		},
		{
			accessorKey: 'system_version',
			header: '系统版本',
			cell: ({ row }) => <div>{row.getValue('system_version')}</div>,
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const device = row.original;
				return (
					<div className='flex flex-row gap-2'>
						<Button
							variant='outline'
							onClick={() => onDeleteDevices([device.id])}>
							<Trash2 />
							删除
						</Button>
						<Button
							variant='outline'
							onClick={() => onShowDeviceDetail(device.id)}>
							<BookOpen />
							详情
						</Button>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: data ? data.elements : [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		manualPagination: true, //turn off client-side pagination,
		rowCount: data ? data.total_elements : 0,
		state: {
			rowSelection,
		},
	});

	const onDeleteDevices = async (ids: string[]) => {
		const [res, err] = await deleteDevices(ids);
		if (err) {
			toast.error(err.message);
			return;
		}
		toast.success('删除成功');
		await onGetDevice(pagination.pageIndex, pagination.pageSize);
	};

	const onShowDeviceDetail = async (id: string) => {
		setShowDeviceDetail(true);
		const [res, err] = await getDeviceDetail(id);
		if (err) {
			toast.error(err.message);
			return;
		}
		setDeviceDetail(res);
	};

	const onGetDevice = async (pageNum: number, pageSize: number) => {
		const [res, err] = await searchDevice(pageNum, pageSize);
		if (err) {
			toast.error(err.message);
			return;
		}
		setData(res);
	};

	const onDeleteDeviceBatch = async () => {
		const ids = data?.elements
			.filter((item, index) => rowSelection[index] == true)
			.map((item) => item.id);
		ids && onDeleteDevices(ids);
		setRowSelection({});
		await onGetDevice(1, 10);
	};

	useEffect(() => {
		onGetDevice(pagination.pageIndex, pagination.pageSize);
	}, []);

	const onGetNextPage = async () => {
		await onGetDevice(pagination.pageIndex + 1, pagination.pageSize);
		setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
		setRowSelection({});
	};

	const onGetPreviousPage = async () => {
		await onGetDevice(pagination.pageIndex - 1, pagination.pageSize);
		setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
		setRowSelection({});
	};

	return (
		<div className='w-full'>
			<Dialog open={showDeviceDetail} onOpenChange={setShowDeviceDetail}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>设备详情</DialogTitle>
					</DialogHeader>
					<div className='text-sm break-words gap-2 flex flex-col'>
						<div className='flex flex-row gap-2 items-center'>
							<Label>设备名称</Label>
							{deviceDetail?.device_name}
						</div>
						<div className='flex flex-row gap-2 items-center'>
							<Label>设备系统</Label>
							{deviceDetail?.os_system}
						</div>
						<div className='flex flex-row gap-2 items-center'>
							<Label>系统版本</Label>
							{deviceDetail?.system_version}
						</div>
						<Separator />
						{deviceDetail?.ios_info && (
							<div>
								<h2 className='mb-2'>IOS相关信息</h2>
								<div className='flex flex-row gap-2 items-center'>
									<Label>设备Token</Label>
									<Input
										className='flex-1 line-clamp-1 break-all'
										defaultValue={deviceDetail.ios_info.device_token}
										readOnly
									/>
									<Button
										onClick={() => {
											navigator.clipboard.writeText(
												deviceDetail.ios_info.device_token
											);
											toast.success('复制成功');
										}}
										size='sm'
										className='px-3'>
										<span className='sr-only'>Copy</span>
										<Copy />
									</Button>
								</div>
							</div>
						)}
					</div>

					<DialogFooter className='sm:justify-end'>
						<Button
							type='button'
							variant='secondary'
							onClick={() => {
								setShowDeviceDetail(false);
								setDeviceDetail(null);
							}}>
							关闭
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{!_.isEmpty(rowSelection) && (
				<div className='flex items-center pb-4 justify-between'>
					<div className='flex flex-row items-center gap-5'>
						<Button onClick={onDeleteDeviceBatch}>批量删除</Button>
					</div>
				</div>
			)}

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									暂无相关结果
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{data && (
				<div className='flex items-center justify-end space-x-2'>
					<div className='flex-1 text-sm text-muted-foreground'>
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className='space-x-2'>
						<div className='flex items-center justify-end space-x-2 py-4'>
							<Button
								variant='outline'
								size='sm'
								onClick={onGetPreviousPage}
								disabled={pagination.pageIndex <= 1}>
								上一页
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={onGetNextPage}
								disabled={pagination.pageIndex >= data.total_pages}>
								下一页
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
