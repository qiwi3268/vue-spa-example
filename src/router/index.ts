import {
	createRouter,
	createWebHistory,
	type NavigationGuardNext,
	type RouteLocationNormalized,
	type RouteRecordRaw,
} from 'vue-router';

import useAuthentication from '@/composable/auth';

export enum RouteNames {
	BaseEntities = 'BASE_ENTITIES',
	MarkList = 'MARK_LIST',
}

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import(/* webpackChunkName: "home" */ '@/pages/home-page.vue'),
		children: [],
	},
	{
		path: '/digital-mark',
		redirect: { name: RouteNames.BaseEntities },
		beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
			const { canViewDigitalMark } = useAuthentication();
			if (canViewDigitalMark()) {
				next();
			} else {
				next(from);
			}
		},
		children: [
			{
				path: 'list',
				name: RouteNames.MarkList,
				component: () => import(/* webpackChunkName: "mark-list" */ '@/pages/digital-mark/mark-list-page.vue'),
			},
		],
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: { name: RouteNames.BaseEntities },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
