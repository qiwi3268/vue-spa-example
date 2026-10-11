<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { SmmExpandable, SmmText } from 'ui';
import { ArrowDownIcon } from 'ui-icons';

import { isClickWithoutSpecialKeys } from '@/utils';

import UiIcon from '@/components/ui/ui-icon.vue';

import { INavListItem } from '@/layout/fms-navigation.types';

interface INavListItemProps {
	item: INavListItem;
	isShown?: boolean;
	isNested?: boolean;
	parentName?: string;
	level?: number;
}

const props = withDefaults(defineProps<INavListItemProps>(), {
	isShown: true,
	level: 0,
	isNested: false,
});

const router = useRouter();

const isOpened = ref(false);

const tag = computed((): 'router-link' | 'button' => (props.item.route ? 'router-link' : 'button'));

const hasSelected = computed((): boolean =>
	(props.item.children ?? []).some(child => child.isSelected || hasSelectedChild(child)),
);

const classList = computed(
	(): Record<string, boolean> => ({
		'fms-navigation-item_shown': props.isShown,
		'fms-navigation-item_nested': props.isNested,
		'fms-navigation-item_opened': isOpened.value,
		'fms-navigation-item_selected': !!props.item.isSelected,
		'fms-navigation-item_has-selected': hasSelected.value,
	}),
);

watch(
	() => hasSelected.value,
	(value: boolean) => {
		if (value) {
			isOpened.value = true;
		}
	},
	{ immediate: true },
);

function hasSelectedChild(item: INavListItem): boolean {
	return !!item.children && item.children.some(child => child.isSelected || hasSelectedChild(child));
}

function onClick(e: MouseEvent): void {
	if (props.item.children?.length) {
		isOpened.value = !isOpened.value;
		return;
	}

	if (props.item.route && isClickWithoutSpecialKeys(e)) {
		e.preventDefault();
		router.push(props.item.route);
	}
}
</script>

<template>
	<div
		class="fms-navigation-item"
		:data-level="props.level"
		:class="classList"
	>
		<div class="fms-navigation-item__inner">
			<component
				:is="tag"
				class="fms-navigation-item__button"
				:type="tag === 'button' ? 'button' : undefined"
				:to="props.item.route"
				@click="onClick"
			>
				<span
					v-if="props.item.icon"
					class="fms-navigation-item__icon-wrapper"
				>
					<ui-icon
						:id="props.item.icon"
						class="fms-navigation-item__icon"
					/>
				</span>
				<smm-text
					class="fms-navigation-item__name"
					size="md"
				>
					{{ props.item.name }}
				</smm-text>
				<arrow-down-icon
					class="fms-navigation-item__arrow"
					:class="{ 'fms-navigation-item__arrow_rotated': isOpened }"
				/>
			</component>
			<smm-expandable v-if="props.item.children?.length">
				<div
					v-if="isOpened && props.isShown"
					class="fms-navigation-item__children-list-wrapper"
				>
					<fms-navigation-item
						v-for="child in props.item.children"
						:key="child.id"
						:item="child"
						:is-shown="isShown"
						is-nested
						:level="props.level + 1"
					/>
				</div>
			</smm-expandable>
		</div>
	</div>
</template>

<style scoped lang="scss">
.fms-navigation-item {
	[data-level='2'] {
		.fms-navigation-item__name {
			padding-left: 16px;
		}
	}

	&__inner {
		position: relative;
		transition: transform $smm-middle-duration $smm-effect;

		.fms-navigation-item:not(.fms-navigation-item_nested, .fms-navigation-item_shown) > & {
			transform: translate3d(-4px, 0, 0);

			> .fms-navigation-item__button::before {
				transform: translate3d(4px, 0, 0);
			}
		}
	}

	&__button {
		@include focus-visible;
		@include button-reset;

		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		padding: 12px 48px 12px 52px;
		overflow: hidden;
		text-align: left;
		color: $smm-color-gray-70;
		text-decoration: none;
		transition: color $smm-duration $smm-effect, background-color $smm-duration $smm-effect;

		.fms-navigation-item_nested > .fms-navigation-item__inner > & {
			padding: 12px 16px 12px 52px;
		}

		.fms-navigation-item:not(.fms-navigation-item_nested) > .fms-navigation-item__inner > &::before {
			@media (max-width: 1740px) {
				content: '';
				position: absolute;
				top: calc(50% - 12px);
				left: 0;
				z-index: 1;
				width: 3px;
				height: 24px;
				background: $smm-color-primary;
				border-radius: 0 2px 2px 0;
				opacity: 0;
				transition: opacity $smm-duration $smm-effect, transform $smm-middle-duration $smm-effect;
			}
		}

		.fms-navigation-item_has-selected > .fms-navigation-item__inner > &,
		.fms-navigation-item_selected > .fms-navigation-item__inner > & {
			color: $smm-color-primary;

			&::before {
				opacity: 1 !important;
			}

			.fms-navigation-item__icon {
				fill: $smm-color-primary;
			}
		}

		&:hover {
			color: $smm-color-primary;
			background-color: $smm-color-primary-50;

			.fms-navigation-item__icon {
				fill: $smm-color-primary;
			}

			.fms-navigation-item__arrow {
				fill: $smm-color-primary-20;
			}
		}
	}

	&__icon-wrapper {
		position: absolute;
		top: calc(50% - 12px);
		left: 16px;
		width: 24px;
		height: 24px;
	}

	&__icon {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		fill: $smm-color-neutral-500;
		transition: fill $smm-duration $smm-effect;
	}

	&__name {
		margin: 0 auto 0 0;
		white-space: break-spaces;
	}

	&__arrow {
		position: absolute;
		right: 22px;
		fill: $smm-color-gray;
		transition: transform $smm-middle-duration $smm-effect, fill $smm-duration $smm-effect;

		&_rotated {
			transform: rotate(180deg);
		}
	}

	&__children-list-wrapper {
		transition: height $smm-middle-duration $smm-effect, opacity $smm-middle-duration $smm-effect;
	}
}
</style>
