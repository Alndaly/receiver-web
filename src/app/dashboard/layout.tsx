'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from '@/components/ui/separator';
import TopNav from '@/components/top-nav';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';

export default function Page({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2'>
					<div className='flex items-center px-4 w-full justify-between'>
						<div className='flex gap-2 items-center'>
							<SidebarTrigger />
							<Separator orientation='vertical' className='mr-2 h-4' />
							<TopNav />
						</div>
						<ModeToggle />
					</div>
				</header>
				<div className='flex flex-1 flex-col gap-2 px-5'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
