<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { SmmScroll, SmmText } from 'ui';
import { useRoute, useRouter } from 'vue-router';

import { RouteNames } from '@/router';
import { Breakpoint } from '@/constants';
import useAuthentication from '@/composable/auth';

import FmsNavigationItem from '@/layout/fms-navigation-item.vue';

import { type INavListItem, NavSectionId } from '@/layout/fms-navigation.types';

const route = useRoute();
const router = useRouter();

const windowWidth = ref(window.innerWidth);

const isOpened = ref(false);

const isHovered = ref(false);

const selectedItemId = ref<string | null>(null);

const digitalMarkSection = computed((): INavListItem[] => {
	const { canViewDigitalMark } = useAuthentication();
	return [
		{
			id: NavSectionId.DigitalMark,
			icon: 'digital-mark',
			name: 'Маркировка ЧЗ',
			isAvailable: canViewDigitalMark(),
			children: [
				{
					id: NavSectionId.MarkList,
					name: 'Коды маркировки',
					route: { name: RouteNames.MarkList },
					isSelected: selectedItemId.value === NavSectionId.MarkList,
				},
			],
		},
	]
		.filter(item => isNavItemAvailable(item))
		.map(item => filterChildren(item));
});


const navItems = computed((): INavListItem[] => [
	...digitalMarkSection.value,
]);

const sections = computed((): { name: string; items: INavListItem[] }[] =>
	[
		{ name: 'Честный знак', items: digitalMarkSection.value },
	].filter(section => section.items.length),
);

function filterChildren(item: INavListItem): INavListItem {
	return {
		...item,
		isSelected: selectedItemId.value === item.id,
		children:
			item.children?.filter(child => isNavItemAvailable(child)).map(child => filterChildren(child)) ?? undefined,
	};
}

function isNavItemAvailable(item: INavListItem): boolean {
	return (
		item.isAvailable !== false &&
		(!item.children?.length || !!item.children?.some(child => isNavItemAvailable(child)))
	);
}

const isShown = computed(
	(): boolean =>
		(isOpened.value && windowWidth.value >= Breakpoint.Md) || windowWidth.value >= Breakpoint.Lg || isHovered.value,
);

const classList = computed(
	(): Record<string, boolean> => ({
		'fms-navigation_shown': isShown.value,
		'fms-navigation_hovered': isHovered.value,
		'fms-navigation_opened': isOpened.value,
	}),
);

watch(
	() => route.name,
	() => {
		onUrlChange();
	},
);

onBeforeUnmount(() => {
	window.removeEventListener('resize', onResize);
});

function onResize(): void {
	windowWidth.value = window.innerWidth;
}

function onUrlChange(): void {
	checkSelectedNavItems(navItems.value);
}

function checkSelectedNavItems(list: INavListItem[]): void {
	list.forEach(item => {
		if (isNavItemSelected(item)) {
			selectedItemId.value = item.id;
		} else if (selectedItemId.value === item.id) {
			selectedItemId.value = null;
		}

		if (item.children && item.children.length) {
			checkSelectedNavItems(item.children);
		}
	});
}

function isNavItemSelected(item: INavListItem): boolean {
	if (item.route) {
		return router.currentRoute.value.name === item.route?.name;
	}

	return false;
}

function onCreated(): void {
	onResize();
	window.addEventListener('resize', onResize);
}

onCreated();
</script>

<template>
	<nav
		class="fms-navigation"
		:class="classList"
		@mouseleave="isHovered = false"
	>
		<div
			class="fms-navigation__wrapper"
			@mouseenter="isHovered = true"
		>
			<div class="fms-navigation__body">
				<smm-scroll class="fms-navigation__scroll">
					<div>
						<div
							v-for="section in sections"
							:key="section.name"
							class="fms-navigation__section"
						>
							<smm-text
								class="fms-navigation__section-title"
								tag="p"
							>
								{{ section.name }}
							</smm-text>
							<fms-navigation-item
								v-for="item in section.items"
								:key="item.id"
								:item="item"
								:is-shown="isShown"
							/>
						</div>
					</div>
				</smm-scroll>
			</div>
		</div>
	</nav>
</template>

<style scoped lang="scss">
.fms-navigation {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	width: 300px;
	height: 100%;
	background: $smm-color-white;
	transition: width $smm-middle-duration $smm-effect;

	&:not(.fms-navigation_shown) {
		width: 48px;

		.fms-navigation__section-title {
			display: none;
		}
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 1px;
		height: 100%;
		background: $smm-color-gray-30;
	}

	&__wrapper {
		display: flex;
		width: 100%;
		min-width: 100%;
		max-width: 100%;
		overflow: hidden;
	}

	&__body {
		position: relative;
		display: flex;
		width: 300px;
		min-width: 300px;
		max-width: 300px;
	}

	&__scroll {
		position: absolute;
		top: 60px;
		left: 0;
		width: 100%;
		max-width: 100%;
		height: calc(100% - 60px);
		background: $smm-color-white;

		:deep(.smm-scroll__content) {
			display: flex;
			flex-direction: column;
			min-height: 100%;
		}
	}

	&__section {
		width: 100%;
		max-width: 100%;
		margin: 0;
	}

	&__section-title {
		padding: 12px 16px;
		color: $smm-color-neutral-600;
	}
}
</style>
