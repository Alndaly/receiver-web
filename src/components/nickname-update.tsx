'use client';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import {
	updateNickname,
} from '@/service/user';
import { useUserStore } from '@/stores/user-store-provider';

const nicknameFormSchema = z.object({
	nickname: z.string().min(1).max(10),
});

const NicknameUpdate = () => {
	const { userInfo, refreshUserInfo } = useUserStore((state) => state);
	const [formSubmitStatus, setFormSubmitStatus] = useState(false);
	const [showNicknameUpdateFormDialog, setShowNicknameUpdateFormDialog] =
		useState(false);
	const form = useForm<z.infer<typeof nicknameFormSchema>>({
		resolver: zodResolver(nicknameFormSchema),
		defaultValues: {
			nickname: '',
		},
	});

	const onSubmitNicknameUpdateForm = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
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

		return form.handleSubmit(onFormValidateSuccess, onFormValidateError)(event);
	};

	const onFormValidateSuccess = async (
		values: z.infer<typeof nicknameFormSchema>
	) => {
		setFormSubmitStatus(true);
		const [res, err] = await updateNickname(values.nickname);
		if (err) {
			toast.error(err.message);
			setFormSubmitStatus(false);
			return;
		}
		toast.success('更新成功');
		setFormSubmitStatus(false);
		refreshUserInfo();
		setShowNicknameUpdateFormDialog(false);
	};

	const onFormValidateError = (errors: any) => {
		console.log(errors);
		toast.error('表单校验失败');
	};
	return (
		<>
			<div className='flex flex-row items-center'>
				{userInfo.nickname && (
					<div className='font-bold text-xs'>{userInfo.nickname}</div>
				)}
				<Button
					variant={'link'}
					className='text-xs'
					onClick={() => setShowNicknameUpdateFormDialog(true)}
					type='button'>
					修改昵称
				</Button>
			</div>
			<Dialog
				open={showNicknameUpdateFormDialog}
				onOpenChange={setShowNicknameUpdateFormDialog}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>修改昵称</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={onSubmitNicknameUpdateForm} className='space-y-5'>
							<div className='space-y-5'>
								<FormField
									control={form.control}
									name='nickname'
									render={({ field }) => (
										<FormItem>
											<div className='flex flex-col gap-2'>
												<FormControl>
													<Input
														type='text'
														placeholder='请输入你想取的昵称'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter className='sm:justify-end'>
								<Button type='submit' disabled={formSubmitStatus}>
									确认
									{formSubmitStatus && (
										<Loader2 className='h-4 w-4 animate-spin' />
									)}
								</Button>
								<DialogClose asChild>
									<Button type='button' variant='secondary'>
										取消
									</Button>
								</DialogClose>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default NicknameUpdate;
