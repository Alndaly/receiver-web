'use client';

import { useEffect, useState } from 'react';
import { searchAuthority } from '@/service/authority';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	RowSelectionState,
} from '@tanstack/react-table';
import _ from 'lodash';
import { CirclePlus } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { searchAPIKey, deleteAPIKey, createAPIKey } from '@/service/apikey';
import { PaginationData } from '@/schemas/pagination';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Badge } from './ui/badge';

interface Authority {
	name: string;
	id: number;
}

const AddApiKeyFormSchema = z.object({
	description: z
		.string()
		.min(0, { message: 'Description is required' })
		.max(10, { message: 'Description is too long' }),
	authorities: z.array(z.number()),
});

export type APIKey = {
	id: string;
	description: string;
	api_key: string;
	last_used_time: string;
	created_time: string;
};

export function APIKeyTable() {
	const form = useForm<z.infer<typeof AddApiKeyFormSchema>>({
		resolver: zodResolver(AddApiKeyFormSchema),
		defaultValues: {
			description: '',
			authorities: [],
		},
	});

	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [showAddAPIKeyDialog, setShowAddAPIKeyDialog] = useState(false);
	const [data, setData] = useState<PaginationData<APIKey> | null>(null);
	const [searchKeyWord, setSearchKeyWord] = useState('');
	const [pagination, setPagination] = useState({
		pageIndex: 1, //initial page index
		pageSize: 10, //default page size
	});
	const [authorities, setAuthorities] =
		useState<PaginationData<Authority> | null>();

	const onSearchAuthorities = async () => {
		const [res, err] = await searchAuthority('', 1, 10);
		if (err) {
			toast.error(err.message);
			return;
		}
		setAuthorities(res);
	};

	const columns: ColumnDef<APIKey>[] = [
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
			accessorKey: 'api_key',
			header: 'API Key',
			cell: ({ row }) => <div>{row.getValue('api_key')}</div>,
		},
		{
			accessorKey: 'description',
			header: '描述',
			cell: ({ row }) => <div>{row.getValue('description')}</div>,
		},
		{
			accessorKey: 'authorities',
			header: '权限',
			cell: ({ row }) => {
				const authorities: [Authority] = row.getValue('authorities');
				return (
					<div className='flex flex-row gap-1'>
						{authorities.map((authority) => (
							<Badge key={authority.id} variant={'outline'}>
								{authority.name}
							</Badge>
						))}
					</div>
				);
			},
		},
		{
			accessorKey: 'last_used_time',
			header: '上次使用时间',
			cell: ({ row }) => <div>{row.getValue('last_used_time')}</div>,
		},
		{
			accessorKey: 'create_time',
			header: '创建时间',
			cell: ({ row }) => <div>{row.getValue('create_time')}</div>,
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const apikey = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(apikey.api_key)}>
								复制apikey
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDeleteAPIKey([apikey.id])}>
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

	const onDeleteAPIKey = async (ids: string[]) => {
		const [res, err] = await deleteAPIKey(ids);
		if (err) {
			toast.error(err.message);
			return;
		}
		await onGetAPIKey(searchKeyWord, pagination.pageIndex, pagination.pageSize);
	};

	const onGetAPIKey = async (
		keyword: string,
		pageNum: number,
		pageSize: number
	) => {
		const [res, err] = await searchAPIKey(keyword, pageNum, pageSize);
		if (err) {
			toast.error(err.message);
			return;
		}
		setData(res);
	};

	const onSubmitAddForm = async (event: React.FormEvent<HTMLFormElement>) => {
		// this part is for stopping parent forms to trigger their submit
		if (event) {
			// sometimes not true, e.g. React Native
			if (typeof event.preventDefault === 'function') {
				event.preventDefault();
			}
			if (typeof event.stopPropagation === 'function') {
				// prevent any outer forms from receiving the event too
				event.stopPropagation();
			}
		}

		return form.handleSubmit(onSuccess, onError)(event);
	};

	const onSuccess = async (values: z.infer<typeof AddApiKeyFormSchema>) => {
		const [res, err] = await createAPIKey(
			values.description,
			values.authorities
		);
		if (err) {
			toast.error(err.message);
			return;
		}
		setShowAddAPIKeyDialog(false);
		form.reset();
		await onGetAPIKey(searchKeyWord, pagination.pageIndex, pagination.pageSize);
		toast.success('更新成功');
	};

	const onError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};

	const onDeleteAPIKeyBatch = async () => {
		const ids = data?.elements
			.filter((item, index) => rowSelection[index] == true)
			.map((item) => item.id);
		ids && onDeleteAPIKey(ids);
		setRowSelection({});
		await onGetAPIKey(searchKeyWord, 1, 10);
	};

	useEffect(() => {
		onGetAPIKey(searchKeyWord, pagination.pageIndex, pagination.pageSize);
		onSearchAuthorities();
	}, []);

	const onGetNextPage = async () => {
		await onGetAPIKey(
			searchKeyWord,
			pagination.pageIndex + 1,
			pagination.pageSize
		);
		setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
		setRowSelection({});
	};

	const onGetPreviousPage = async () => {
		await onGetAPIKey(
			searchKeyWord,
			pagination.pageIndex - 1,
			pagination.pageSize
		);
		setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
		setRowSelection({});
	};

	return (
		<div className='w-full'>
			<div className='flex items-center pb-4 justify-between'>
				<div className='flex flex-row gap-5'>
					<Input
						placeholder='请输入描述'
						value={searchKeyWord}
						onChange={(e) => setSearchKeyWord(e.target.value)}
						className='max-w-sm'
					/>
					<Button onClick={() => onGetAPIKey(searchKeyWord, 1, 10)}>
						搜索
					</Button>
				</div>

				<div className='flex flex-row items-center gap-5'>
					{!_.isEmpty(rowSelection) && (
						<Button onClick={onDeleteAPIKeyBatch}>批量删除</Button>
					)}
					<Dialog
						open={showAddAPIKeyDialog}
						onOpenChange={setShowAddAPIKeyDialog}>
						<DialogTrigger asChild>
							<Button onClick={() => setShowAddAPIKeyDialog(true)}>
								<CirclePlus />
								增加API Key
							</Button>
						</DialogTrigger>
						<DialogContent className='sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle>新建API Key</DialogTitle>
								<DialogDescription>
									新建一个API Key，完成后点击保存。
								</DialogDescription>
							</DialogHeader>
							<Form {...form}>
								<form onSubmit={onSubmitAddForm} className='space-y-3'>
									<FormField
										control={form.control}
										name='description'
										render={({ field }) => {
											return (
												<div className='grid grid-cols-4 items-center gap-4'>
													<Label className='text-right'>描述</Label>
													<Input
														className='col-span-3'
														value={field.value}
														onChange={(e) => field.onChange(e.target.value)}
													/>
												</div>
											);
										}}
									/>
									<FormField
										control={form.control}
										name='authorities'
										render={({ field }) => {
											return (
												<div className='grid grid-cols-4 items-start gap-4'>
													<Label className='text-right'>权限</Label>
													<div className='flex flex-col gap-2 col-span-3'>
														{authorities?.elements.map((authority) => (
															<FormField
																key={authority.id}
																control={form.control}
																name='authorities'
																render={({ field }) => {
																	return (
																		<div
																			key={authority.id}
																			className='flex flex-row items-center gap-2'>
																			<FormControl>
																				<Checkbox
																					checked={field.value?.includes(
																						authority.id
																					)}
																					onCheckedChange={(checked) => {
																						const newValue = new Set(
																							field.value
																						);
																						if (checked) {
																							newValue.add(authority.id);
																						} else {
																							newValue.delete(authority.id);
																						}
																						field.onChange(
																							Array.from(newValue)
																						);
																					}}
																				/>
																			</FormControl>
																			<FormLabel className='text-sm font-normal'>
																				{authority.name}
																			</FormLabel>
																		</div>
																	);
																}}
															/>
														))}
														<FormMessage />
													</div>
												</div>
											);
										}}
									/>
									<DialogFooter>
										<Button type='submit'>保存</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
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
						{data.total_elements} row(s) selected.
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
