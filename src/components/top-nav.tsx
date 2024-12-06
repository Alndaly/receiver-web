'use client';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import routers, { findRouteByPath } from '@/config/router';
import Link from 'next/link';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Crumb {
	title?: string;
	path: string;
}

const TopNav = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [crumbs, setCrumbs] = useState<Crumb[]>([]);

	useEffect(() => {
		console.log(pathname)
		const paths = pathname
			.split('/')
			.filter((path) => path !== '')
			.map((path, index, array) => {
				return {
					title: findRouteByPath(routers, `/${array.slice(0, index + 1).join('/')}`)?.title,
					path: `/${array.slice(0, index + 1).join('/')}`,
				};
			});
		setCrumbs(paths);
	}, [pathname, searchParams]);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{crumbs.map((crumb, index) => {
					return (
						<div key={index} className='flex flex-row items-center gap-1.5'>
							<BreadcrumbItem className='hidden md:block'>
								<Link href={crumb.path}>{crumb.title}</Link>
							</BreadcrumbItem>
							{index !== crumbs.length - 1 && (
								<BreadcrumbSeparator className='hidden md:block' />
							)}
						</div>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default TopNav;
