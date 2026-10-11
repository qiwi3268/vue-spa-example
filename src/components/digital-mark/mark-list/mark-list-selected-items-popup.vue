<script setup lang="ts">
import { SmmButton, SmmText } from 'ui';
import { CrossIcon, MagicIcon, MinusIcon, TrashIcon } from 'ui-icons';

interface IMarkListSelectedItemPopupProps {
	count: number;
}

const props = defineProps<IMarkListSelectedItemPopupProps>();

const emit = defineEmits<{
	(e: 'check'): void;
	(e: 'edit'): void;
	(e: 'exclude'): void;
	(e: 'delete'): void;
	(e: 'close'): void;
}>();
</script>

<template>
	<div class="mark-list-selected-items-popup">
		<smm-text class="mark-list-selected-items-popup__text">Выбрано шт. {{ props.count }}</smm-text>
		<div class="mark-list-selected-items-popup__buttons">
			<smm-button
				class="mark-list-selected-items-popup__button"
				mod="outline"
				theme="dark"
				@click="emit('check')"
			>
				<template #prefix>
					<magic-icon />
				</template>
				<template #default>Перепроверить</template>
			</smm-button>
			<smm-button
				class="mark-list-selected-items-popup__button"
				mod="outline"
				theme="dark"
				@click="emit('exclude')"
			>
				<template #prefix>
					<minus-icon />
				</template>
				<template #default>Убрать из УПД</template>
			</smm-button>
			<smm-button
				class="mark-list-selected-items-popup__button"
				mod="outline"
				theme="dark"
				@click="emit('delete')"
			>
				<template #prefix>
					<trash-icon />
				</template>
				<template #default>Удалить код</template>
			</smm-button>
		</div>
		<cross-icon
			class="mark-list-selected-items-popup__close"
			@click="emit('close')"
		/>
	</div>
</template>

<style scoped lang="scss">
.mark-list-selected-items-popup {
	position: fixed;
	bottom: 16px;
	left: 50%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 60px;
	padding: 12px 16px;
	font-weight: $smm-font-weight-semibold;
	color: $smm-color-white;
	background-color: $smm-color-primary-700;
	border-radius: 12px;
	gap: 24px;
	translate: (-50%);

	&__text {
		white-space: nowrap;
	}

	&__buttons {
		display: flex;
		gap: 8px;
	}

	&__button {
		:deep(.smm-button__prefix svg) {
			width: 20px;
			height: 20px;
		}
	}

	&__close {
		color: $smm-color-neutral-500;
		cursor: pointer;
	}
}
</style>
