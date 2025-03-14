export type RouteItem = {
	title: string;
	path: string;
	children?: RouteItem[];
};

const routers: RouteItem[] = [
	{
		title: '管理台',
		path: '/dashboard',
		children: [
			{
				title: '用户管理',
				path: '/account',
			},
			{
				title: '通知记录查看',
				path: '/notification',
				children: [
					{
						title: '通知详情',
						path: '/detail',
					},
				],
			},
			{
				title: 'APIKEY管理',
				path: '/apikey',
			},
			{
				title: '设备管理',
				path: '/device',
			},
			{
				title: '任务管理',
				path: '/task',
				children: [
					{
						title: '任务编辑',
						path: '/edit',
					},
				],
			},
		],
	},
];

export default routers;

// 根据全路径查找title的辅助函数
export const findRouteByPath = (
	routes: RouteItem[],
	fullPath: string,
	parentRoute = ''
): RouteItem | null => {
	for (const route of routes) {
		// 拼接父路径和当前路径
		const currentFullPath = `${parentRoute}${route.path}`;
		if (currentFullPath === fullPath) {
			return route;
		}
		// 如果有子节点，递归查找
		const childrenRoute = route?.children;
		if (childrenRoute) {
			const route = findRouteByPath(childrenRoute, fullPath, currentFullPath);
			if (route) return route;
		}
	}
	return null;
};
