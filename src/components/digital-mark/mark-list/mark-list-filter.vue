<script setup lang="ts">
import { SmmButton, SmmCheckbox, SmmInput, SmmMultiselect } from 'ui';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { positiveIntegerMask } from '@/utils';
import {
	DIGITAL_MARK_CATEGORY_OPTIONS,
	DIGITAL_MARK_STATE_OPTIONS,
	DigitalMarkCategory,
	DigitalMarkState,
} from '@/constants/digital-mark/digital-mark';

import type { IMarkListFilter } from '@/stores/digital-mark/digital-mark';

const emit = defineEmits<{
	(e: 'update:filter', value: IMarkListFilter): void;
	(e: 'init:filter', value: IMarkListFilter): void;
	(e: 'clear:filter'): void;
}>();

const route = useRoute();
const router = useRouter();

const merchantId = ref('');

const baseEntityExternalId = ref('');

const stateIds = ref<DigitalMarkState[]>([]);

const categoryIds = ref<DigitalMarkCategory[]>([]);

const hasErrors = ref(false);

const selectedStates = computed((): DigitalMarkState[] => {
	const result = [...stateIds.value];

	if (result.includes(DigitalMarkState.Retired)) {
		result.push(DigitalMarkState.Withdrawn);
	}

	if (result.includes(DigitalMarkState.Disaggregation)) {
		result.push(DigitalMarkState.Disaggregated);
	}

	return result;
});

const filter = computed(
	(): IMarkListFilter => ({
		stateIds: selectedStates.value,
		merchantId: merchantId.value ? Number(merchantId.value) : null,
		baseEntityExternalId: baseEntityExternalId.value,
		groupIds: categoryIds.value,
		hasErrors: hasErrors.value,
	}),
);

async function onChangeFilter(): Promise<void> {
	await updateUrl();
	emit('update:filter', filter.value);
}

function parseUrl(): void {
	if (route.query.stateIds && typeof route.query.stateIds === 'string') {
		stateIds.value = JSON.parse(route.query.stateIds);
	}

	if (route.query.merchantId && typeof route.query.merchantId === 'string') {
		merchantId.value = route.query.merchantId;
	}

	if (route.query.baseEntityExternalId && typeof route.query.baseEntityExternalId === 'string') {
		baseEntityExternalId.value = route.query.baseEntityExternalId;
	}

	if (route.query.categoryIds && typeof route.query.categoryIds === 'string') {
		categoryIds.value = JSON.parse(route.query.categoryIds);
	}

	if (route.query.hasErrors && typeof route.query.hasErrors === 'string') {
		hasErrors.value = JSON.parse(route.query.hasErrors);
	}
}

async function updateUrl(): Promise<void> {
	await router
		.replace({
			name: route.name ?? '',
			query: {
				...route.query,
				stateIds: stateIds.value.length ? JSON.stringify(stateIds.value) : undefined,
				merchantId: merchantId.value ? merchantId.value : undefined,
				baseEntityExternalId: baseEntityExternalId.value ? baseEntityExternalId.value : undefined,
				categoryIds: categoryIds.value.length ? JSON.stringify(categoryIds.value) : undefined,
				hasErrors: hasErrors.value ? JSON.stringify(hasErrors.value) : undefined,
			},
		})
		.catch();
}

async function onClearFilter(): Promise<void> {
	baseEntityExternalId.value = '';
	merchantId.value = '';
	categoryIds.value = [];
	stateIds.value = [];
	hasErrors.value = false;
	await updateUrl();
	emit('clear:filter');
}

async function onCreated(): Promise<void> {
	parseUrl();
	await updateUrl();
	emit('init:filter', filter.value);
}

onCreated();
</script>

<template>
	<div class="mark-list-filter">
		<div class="mark-list-filter__row">
			<smm-multiselect
				v-model="stateIds"
				class="mark-list-filter__field"
				name="mark-list-states"
				label="Статус КМ"
				placeholder="Все"
				:options="DIGITAL_MARK_STATE_OPTIONS"
				:max-tag-count="1"
				@update:model-value="onChangeFilter"
			/>
			<smm-input
				v-model="merchantId"
				class="mark-list-filter__field"
				name="mark-list-merchant"
				placeholder="Все"
				label="Мерчант"
				:format="positiveIntegerMask"
				@change="onChangeFilter"
			/>
			<smm-input
				v-model="baseEntityExternalId"
				class="mark-list-filter__field"
				name="mark-list-base-entity"
				placeholder="Все"
				label="Заявка на поставку/на вывоз"
				@change="onChangeFilter"
			/>
			<smm-multiselect
				v-model="categoryIds"
				class="mark-list-filter__field"
				name="mark-list-categories"
				label="Товарная категория"
				placeholder="Все"
				:options="DIGITAL_MARK_CATEGORY_OPTIONS"
				clearable
				:max-tag-count="1"
				@update:model-value="onChangeFilter"
			/>
			<smm-checkbox
				v-model="hasErrors"
				class="mark-list-filter__checkbox"
				name="is-error"
				label="Только коды с ошибкой"
				@update:model-value="onChangeFilter"
			/>
		</div>
		<smm-button
			mod="transparent"
			@click="onClearFilter"
		>
			Сбросить все
		</smm-button>
	</div>
</template>

<style scoped lang="scss">
.mark-list-filter {
	&__row {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 4px;
	}

	&__field {
		width: 240px;
		min-width: 240px;
	}

	&__checkbox {
		align-items: flex-end;
		margin-bottom: 10px;
	}
}
</style>
