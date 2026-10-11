<script setup lang="ts">
import { SmmButton, SmmModal, SmmText, SmmTitle } from 'ui';

import { MODAL_Z_INDEX } from '@/constants';

interface IUiModalConfirmProps {
	isOpened: boolean;
	title?: string;
	text?: string;
	acceptLabel?: string;
	rejectLabel?: string;
}

const props = defineProps<IUiModalConfirmProps>();

const emit = defineEmits<{
	(e: 'accept'): void;
	(e: 'reject'): void;
	(e: 'close'): void;
}>();

function onAccept(): void {
	emit('accept');
	emit('close');
}
</script>

<template>
	<smm-modal
		class="ui-modal-confirm"
		:model-value="props.isOpened"
		:z-index="MODAL_Z_INDEX"
		@update:model-value="emit('close')"
	>
		<template
			v-if="props.title"
			#header
		>
			<smm-title>
				{{ props.title }}
			</smm-title>
		</template>
		<template
			v-if="props.text"
			#body
		>
			<smm-text>
				{{ props.text }}
			</smm-text>
		</template>
		<template #footer>
			<div class="ui-modal-confirm__footer">
				<smm-button
					mod="outline"
					@click="emit('close')"
				>
					{{ props.rejectLabel ?? 'Нет' }}
				</smm-button>
				<smm-button @click="onAccept">{{ props.acceptLabel ?? 'Да' }}</smm-button>
			</div>
		</template>
	</smm-modal>
</template>

<style scoped lang="scss">
.ui-modal-confirm {
	:deep(.smm-modal__body) {
		padding: 0 24px;
	}

	&__footer {
		display: flex;
		gap: 16px;
		justify-content: flex-end;
	}
}
</style>
