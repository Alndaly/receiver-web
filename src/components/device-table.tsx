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
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { searchDevice, deleteDevices } from '@/service/device';
import { PaginationData } from '@/schemas/pagination';
import { toast } from 'sonner';

export type Device = {
	id: string;
	device_id: string;
	device_name: string;
	device_os: string;
};

export function DeviceTable() {
	const [newAPIKeyDescription, setNewAPIKeyDescription] = useState('');
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [showAddAPIKeyDialog, setShowAddAPIKeyDialog] = useState(false);
	const [data, setData] = useState<PaginationData<Device> | null>(null);
	const [searchKeyWord, setSearchKeyWord] = useState('');
	const [pagination, setPagination] = useState({
		pageIndex: 1, //initial page index
		pageSize: 10, //default page size
	});

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
			accessorKey: 'device_id',
			header: '设备ID',
			cell: ({ row }) => <div>{row.getValue('device_id')}</div>,
		},
		{
			accessorKey: 'device_name',
			header: '设备名称',
			cell: ({ row }) => <div>{row.getValue('device_name')}</div>,
		},
		{
			accessorKey: 'device_os',
			header: '设备系统',
			cell: ({ row }) => <div>{row.getValue('device_os')}</div>,
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const device = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={() => onDeleteDevices([device.id])}>
								删除
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
		await onGetDevice(pagination.pageIndex, pagination.pageSize);
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
			<div className='flex items-center pb-4 justify-between'>
				<div className='flex flex-row items-center gap-5'>
					{!_.isEmpty(rowSelection) && (
						<Button onClick={onDeleteDeviceBatch}>批量删除</Button>
					)}
				</div>
			</div>
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
