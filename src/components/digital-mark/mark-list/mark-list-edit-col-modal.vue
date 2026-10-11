<script setup lang="ts">
import { SmmButton, SmmModal, SmmTextarea, SmmTitle } from 'ui';
import { ref, watch } from 'vue';

import { MODAL_Z_INDEX } from '@/constants';

interface IMarkListEditColModalProps {
	title: string;
	modelValue: string;
	isOpened: boolean;
}

const props = defineProps<IMarkListEditColModalProps>();

const emit = defineEmits<{
	(e: 'close'): void;
	(e: 'update:model-value', value: string): void;
}>();

const text = ref('');

watch(
	() => props.isOpened,
	() => {
		if (props.isOpened) {
			text.value = props.modelValue;
		}
	},
);
</script>

<template>
	<smm-modal
		class="mark-list-edit-col-modal"
		:model-value="props.isOpened"
		:z-index="MODAL_Z_INDEX"
		@update:model-value="emit('close')"
	>
		<template #header>
			<div class="mark-list-edit-col-modal__header">
				<smm-title>{{ props.title }}</smm-title>
			</div>
		</template>
		<template #body>
			<smm-textarea
				v-model="text"
				class="mark-list-edit-col-modal__text-area"
				name="reason"
				placeholder="Введите новое значение"
			/>
		</template>
		<template #footer>
			<div class="mark-list-edit-col-modal__footer">
				<smm-button
					mod="outline"
					@click="emit('close')"
				>
					Назад
				</smm-button>
				<smm-button
					:disabled="!text"
					@click="emit('update:model-value', text)"
				>
					Сохранить
				</smm-button>
			</div>
		</template>
	</smm-modal>
</template>

<style scoped lang="scss">
.mark-list-edit-col-modal {
	:deep(.smm-modal__dialog) {
		max-width: 420px;
	}

	&__text-area {
		flex-grow: 1;
		width: 100%;

		:deep(.smm-textarea__textarea) {
			width: 100%;
		}
	}

	&__footer {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}
}
</style>
