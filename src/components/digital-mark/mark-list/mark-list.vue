<script setup lang="ts">
import {
	type ISmmTableColumnV2,
	type ISmmTableSortV2,
	type ISmmTableSort,
	SmmButton,
	SmmCheckbox,
	SmmInput,
	SmmMultiselect,
	SmmPagination,
	SmmSelect,
	SmmStatus,
	SmmTable,
	SmmText,
	SmmTooltip,
	SortOrder,
} from 'ui';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import cloneDeep from 'lodash.clonedeep';
import { AttentionIcon, CopyIcon, DownloadIcon, PenIcon, SearchIcon, SettingIcon, TimeIcon } from 'ui-icons';
import { copyTextToClipboard } from 'utils';
import isEqual from 'lodash.isequal';

import usePagination, { type ISelectOption } from '@/composable/pagination';
import useMcssErrorHandler from '@/composable/mcss-error';
import { LIMIT_OPTIONS } from '@/constants';
import {
	DIGITAL_MARK_CATEGORY_OPTIONS,
	DIGITAL_MARK_STATE_MODIFIERS,
	DIGITAL_MARK_STATE_TEXT,
	DigitalMarkState,
} from '@/constants/digital-mark/digital-mark';

import { BaseEntitySort } from '@/services/api/digital-mark/base-entity';
import { useNotificationService } from '@/services';
import { DigitalMarkSort, type IDigitalMarkModel } from '@/services/api/digital-mark/digital-mark';

import MarkListFilter from '@/components/digital-mark/mark-list/mark-list-filter.vue';
import MarkListSelectedItemsPopup from '@/components/digital-mark/mark-list/mark-list-selected-items-popup.vue';
import MarkListEditColModal from '@/components/digital-mark/mark-list/mark-list-edit-col-modal.vue';
import UiModalConfirm from '@/components/ui/ui-modal-confirm.vue';
import UiIcon from '@/components/ui/ui-icon.vue';

import useSystemStore from '@/stores/system';
import useDigitalMarkStore, { type IMarkListFilter } from '@/stores/digital-mark/digital-mark';

enum MarkListColumn {
	Checkbox = 'checkbox',
	ItemName = 'itemName',
	StateId = 'stateId',
	ShortCode = 'shortCode',
	OfferId = 'offerId',
	MerchantId = 'merchantId',
	GroupId = 'groupId',
	BaseEntityExternalId = 'baseEntityExternalId',
	OwnerInn = 'ownerInn',
	FullCode = 'fullCode',
}

const notificationService = useNotificationService();

const emit = defineEmits<{
	(e: 'update:is-restriction-modal-opened', value: boolean): void;
}>();

const DEFAULT_FILTER: IMarkListFilter = {
	baseEntityExternalId: '',
	merchantId: null,
	groupIds: [],
	stateIds: [],
	hasErrors: false,
};

const systemStore = useSystemStore();
const digitalMarkStore = useDigitalMarkStore();

const mcssErrorHandler = useMcssErrorHandler();
const router = useRouter();
const route = useRoute();

const { digitalMarkList, digitalMarkTotal, merchantList } = storeToRefs(digitalMarkStore);

const COLUMNS: ISmmTableColumnV2[] = [
	{
		name: '',
		checkbox: true,
		prop: MarkListColumn.Checkbox,
		maxWidth: '50px',
		minWidth: '50px',
		verticalAlign: 'start',
	},
	{
		name: 'Название товара',
		prop: MarkListColumn.ItemName,
		minWidth: '320px',
		maxWidth: '320px',
		verticalAlign: 'start',
	},
	{
		name: 'Статус кода',
		prop: MarkListColumn.StateId,
		maxWidth: '160px',
		minWidth: '160px',
		sortable: true,
		verticalAlign: 'start',
		horizontalAlign: 'end',
	},
	{
		name: 'Короткий КМ',
		prop: MarkListColumn.ShortCode,
		maxWidth: '250px',
		minWidth: '250px',
		verticalAlign: 'start',
	},
	{
		name: 'Артикул продавца',
		prop: MarkListColumn.OfferId,
		maxWidth: '120px',
		minWidth: '120px',
		sortable: true,
		verticalAlign: 'start',
	},
	{
		name: 'Мерчант',
		prop: MarkListColumn.MerchantId,
		maxWidth: '270px',
		minWidth: '270px',
		sortable: true,
		verticalAlign: 'start',
	},
	{
		name: 'Товарная группа',
		prop: MarkListColumn.GroupId,
		maxWidth: '250px',
		minWidth: '250px',
		verticalAlign: 'start',
	},
	{
		name: 'Поставка/заказ',
		prop: MarkListColumn.BaseEntityExternalId,
		maxWidth: '170px',
		minWidth: '170px',
		sortable: true,
		verticalAlign: 'start',
	},
	{
		name: 'Владелец кода',
		prop: MarkListColumn.OwnerInn,
		maxWidth: '150px',
		minWidth: '150px',
		verticalAlign: 'start',
	},
	{
		name: 'КМ с криптохвостом',
		prop: MarkListColumn.FullCode,
		maxWidth: '170px',
		minWidth: '170px',
		verticalAlign: 'start',
	},
];

const REQUIRED_COLUMNS: MarkListColumn[] = [
	MarkListColumn.Checkbox,
	MarkListColumn.ItemName,
	MarkListColumn.StateId,
	MarkListColumn.ShortCode,
	MarkListColumn.OfferId,
	MarkListColumn.MerchantId,
];

const OPTIONAL_COLUMNS: MarkListColumn[] = [
	MarkListColumn.GroupId,
	MarkListColumn.BaseEntityExternalId,
	MarkListColumn.OwnerInn,
	MarkListColumn.FullCode,
];

const filter = ref<IMarkListFilter | null>(null);

const search = ref<string>('');

const sort = ref<ISmmTableSort>({
	field: BaseEntitySort.MerchantId,
	order: SortOrder.Asc,
});

const selectedRows = ref<number[]>([]);

const selectedRow = ref<IDigitalMarkModel | null>(null);

const selectedField = ref<MarkListColumn | null>(null);

const selectedFieldValue = ref('');

const isEditModalOpened = ref(false);

const markIdsToDelete = ref<number[]>([]);

const markIdsToExclude = ref<number[]>([]);

const isConfirmDeletingModalOpened = ref(false);

const isConfirmExcludingModalOpened = ref(false);

const selectedColumns = ref<MarkListColumn[]>(OPTIONAL_COLUMNS);

const columnOptions = computed((): ISelectOption<MarkListColumn>[] =>
	OPTIONAL_COLUMNS.map(item => ({ label: COLUMNS.find(column => column.prop === item)?.name ?? '', value: item })),
);

const displayedColumns = computed((): ISmmTableColumnV2[] => {
	const result = cloneDeep(COLUMNS).filter(
		item =>
			REQUIRED_COLUMNS.includes(item.prop as MarkListColumn) ||
			selectedColumns.value.includes(item.prop as MarkListColumn),
	);

	result[result.length - 2].maxWidth = undefined;

	if (result.length === REQUIRED_COLUMNS.length) {
		result[result.length - 2].horizontalSticky = undefined;
	}

	return result;
});

const deleteModalTitle = computed((): string => (selectedRows.value.length === 1 ? 'Удалить код' : 'Удалить коды'));

const deleteModalText = computed((): string =>
	selectedRows.value.length === 1
		? 'Восстановить код после удаления невозможно'
		: 'Восстановить коды после удаления невозможно',
);

const deleteNotification = computed((): string =>
	selectedRows.value.length === 1 ? 'Удалили код из базы данных' : 'Удалили коды из базы данных',
);

const excludeModalTitle = computed((): string =>
	selectedRows.value.length === 1 ? 'Исключить код' : 'Исключить коды',
);

const excludeModalText = computed((): string =>
	selectedRows.value.length === 1
		? 'Восстановить код после исключения невозможно'
		: 'Восстановить коды после исключения невозможно',
);

const excludeNotification = computed((): string =>
	selectedRows.value.length === 1 ? 'Код исключён' : 'Коды исключения',
);

const {
	limitOptions,
	limit,
	offset,
	selectLimitOptions,
	linkCreator,
	changeLimit,
	changePage,
	parseUrlPaginationParams,
} = usePagination(LIMIT_OPTIONS[2]);
function onLimitChange(value: string | number | null): void {
	changeLimit(value);
	updateUrl();
	updateListing();
}
function onPageChange(page: number, offsetValue: number, event: Event): void {
	changePage(page, offsetValue, event);
	updateUrl();
	updateListing();
}
function updateUrl(): void {
	router
		.replace({
			name: route.name ?? '',
			query: {
				...route.query,
				search: search.value,
				limit: `${limit.value}`,
				page: `${offset.value / limit.value + 1}`,
				sortField: sort.value.field,
				sortOrder: sort.value.order,
			},
		})
		.catch();
}
function parseUrl(): void {
	parseUrlPaginationParams();

	if (route.query.search && typeof route.query.search === 'string') {
		search.value = route.query.search;
	}

	if (route.query.sortField && typeof route.query.sortField === 'string') {
		sort.value.field = route.query.sortField;
	}

	if (route.query.sortOrder && typeof route.query.sortOrder === 'string') {
		sort.value.order = route.query.sortOrder as SortOrder;
	}
}

function onChangeFilter(value: IMarkListFilter): void {
	filter.value = value;
	offset.value = 0;
	updateUrl();
	updateListing();
}

function onSortChange(value: ISmmTableSortV2): void {
	sort.value = value;
	offset.value = 0;
	updateUrl();
	updateListing();
}

function onSearchChange(): void {
	offset.value = 0;
	updateUrl();
	updateListing();
}

async function updateListing(): Promise<void> {
	selectedRows.value = [];

	if (!filter.value || (isEqual(filter.value, DEFAULT_FILTER) && !search.value)) {
		digitalMarkStore.clearDigitalMarkList();
		return;
	}

	systemStore.startLoading();

	try {
		await digitalMarkStore.fetchDigitalMarkList({
			filter: filter.value,
			limit: limit.value,
			offset: offset.value,
			sort: sort.value,
		});
	} catch (e) {
		mcssErrorHandler.handle(e);
	}

	systemStore.finishLoading();
}

async function onCheckCodes(): Promise<void> {
	systemStore.startLoading();

	try {
		await digitalMarkStore.checkDigitalMarks(selectedRows.value);
		notificationService.success({ title: 'Коды отправлены на перепроверку' });
		selectedRows.value = [];
	} catch (e) {
		mcssErrorHandler.handle(e);
	}

	systemStore.finishLoading();
}

function getColumnStyles(columnName: MarkListColumn): Record<string, string> {
	return {
		maxWidth: COLUMNS.find(column => column.prop === columnName)?.maxWidth ?? 'initial',
		minWidth: COLUMNS.find(column => column.prop === columnName)?.minWidth ?? 'initial',
	};
}

function getMerchantName(merchantId: number): string {
	return merchantList.value.find(item => item.merchantId === merchantId)?.legalPersonName ?? '';
}

function getMerchantInn(merchantId: number): string {
	return merchantList.value.find(item => item.merchantId === merchantId)?.inn ?? '';
}

function getCategoryName(groupId: string): string {
	return DIGITAL_MARK_CATEGORY_OPTIONS.find(item => item.value === groupId)?.label ?? '';
}

function isColumnActive(colName: MarkListColumn): boolean {
	return displayedColumns.value.some(item => item.prop === colName);
}

async function onCopyCode(code: string): Promise<void> {
	try {
		await copyTextToClipboard(code);
		notificationService.success('Код скопирован');
		// eslint-disable-next-line no-empty
	} catch (e) {}
}

function onEditField(row: IDigitalMarkModel, field: MarkListColumn): void {
	selectedRow.value = row;
	selectedField.value = field;

	switch (field) {
		case MarkListColumn.ItemName:
			selectedFieldValue.value = row.itemName;
			break;
		case MarkListColumn.ShortCode:
			selectedFieldValue.value = row.shortCode ?? '';
			break;
		case MarkListColumn.FullCode:
			selectedFieldValue.value = row.fullCode ?? '';
			break;
		default:
			selectedFieldValue.value = '';
	}

	isEditModalOpened.value = true;
}

function onCloseUpdateModal(): void {
	isEditModalOpened.value = false;
	selectedRow.value = null;
	selectedField.value = null;
	selectedFieldValue.value = '';
}

async function onUpdateCol(value: string): Promise<void> {
	if (!selectedRow.value?.id) {
		return;
	}

	try {
		switch (selectedField.value) {
			case MarkListColumn.ItemName:
				await digitalMarkStore.updateDigitalMarkItemName(selectedRow.value?.id, value);
				break;
			case MarkListColumn.ShortCode:
				await digitalMarkStore.updateDigitalMarkShortCode(selectedRow.value?.id, value);
				break;
			case MarkListColumn.FullCode:
				await digitalMarkStore.updateDigitalMarkFullCode(selectedRow.value?.id, value);
				break;
			default:
				return;
		}

		notificationService.success({ title: 'Данные успешно изменены' });
		onCloseUpdateModal();
		updateListing();
	} catch (e) {
		mcssErrorHandler.handle(e);
	}
}

function onSelectRow(row: IDigitalMarkModel, isSelected: boolean): void {
	if (isSelected) {
		selectedRows.value.push(row.id);
	} else {
		const index = selectedRows.value.indexOf(row.id);
		selectedRows.value.splice(index, 1);
	}
}

async function onDeleteDigitalMarks(): Promise<void> {
	markIdsToDelete.value = [...selectedRows.value];
	isConfirmDeletingModalOpened.value = true;
}

async function onConfirmDeleting(): Promise<void> {
	try {
		await digitalMarkStore.deleteDigitalMarks(markIdsToDelete.value);
		notificationService.success({ title: deleteNotification.value });
		onRejectDeleting();
		updateListing();
	} catch (e) {
		mcssErrorHandler.handle(e);
	}
}

function onRejectDeleting(): void {
	markIdsToDelete.value = [];
	isConfirmDeletingModalOpened.value = false;
}

async function onExcludeDigitalMarks(): Promise<void> {
	markIdsToExclude.value = [...selectedRows.value];
	isConfirmExcludingModalOpened.value = true;
}

async function onConfirmExcluding(): Promise<void> {
	try {
		await digitalMarkStore.excludeDigitalMarks(markIdsToExclude.value);
		notificationService.success({ title: excludeNotification.value });
		onRejectExcluding();
		updateListing();
	} catch (e) {
		mcssErrorHandler.handle(e);
	}
}

function onRejectExcluding(): void {
	markIdsToExclude.value = [];
	isConfirmExcludingModalOpened.value = false;
}

function getColTitle(col: MarkListColumn | null): string {
	if (!col) {
		return '';
	}
	return COLUMNS.find(item => item.prop === col)?.name ?? '';
}

function onInitFilter(value: IMarkListFilter): void {
	filter.value = value;
	updateUrl();
	updateListing();
}

function onCreated(): void {
	digitalMarkStore.clearDigitalMarkList();
	filter.value = cloneDeep(DEFAULT_FILTER);
	sort.value = {
		field: DigitalMarkSort.BaseEntityExternalId,
		order: SortOrder.Asc,
	};
	search.value = '';
	parseUrl();
}

onCreated();
</script>

<template>
	<div class="mark-list">
		<mark-list-filter
			@update:filter="onChangeFilter"
			@init:filter="onInitFilter"
			@clear:filter="onCreated"
		/>
		<div class="mark-list__header">
			<div class="mark-list__search-wrapper">
				<smm-input
					v-if="false"
					v-model="search"
					class="mark-list__input"
					name="mark-list-search"
					placeholder="Код маркировки"
					clearable
					after
					@change="onSearchChange"
				>
					<template #after-icon>
						<search-icon />
					</template>
				</smm-input>
			</div>
			<smm-text class="mark-list__total">Всего КМ {{ digitalMarkTotal }}</smm-text>
			<smm-button
				v-if="false"
				class="mark-list__download-button"
				mod="transparent"
				size="md"
			>
				<template #default>Скачать таблицу</template>
				<template #prefix><download-icon /></template>
			</smm-button>
			<smm-multiselect
				v-model="selectedColumns"
				class="mark-list__settings"
				:options="columnOptions"
				dropdown-position="bottom-left"
				dropdown-width="300px"
				:dropdown-height="400"
			>
				<template #trigger>
					<smm-button
						icon
						size="md"
						mod="outline"
					>
						<setting-icon />
					</smm-button>
				</template>
			</smm-multiselect>
		</div>
		<smm-table
			v-model:selected-rows="selectedRows"
			class="mark-list__table"
			:rows="digitalMarkList"
			:columns="displayedColumns"
			:current-sort="sort"
			version="2"
			key-prop="id"
			@sort="onSortChange"
		>
			<template #row="row">
				<div
					class="mark-list__row"
					:class="{
						'mark-list__row_error': row.props.row.hasErrors,
						'mark-list__row_warn': row.props.row.isProcessing,
					}"
				>
					<div
						class="mark-list__col"
						:style="getColumnStyles(MarkListColumn.Checkbox)"
					>
						<smm-checkbox
							:model-value="selectedRows.includes(row.props.row.id)"
							name="row-checkbox"
							@update:model-value="onSelectRow(row.props.row, $event)"
						/>
					</div>
					<div
						class="mark-list__col mark-list__col_name"
						:style="getColumnStyles(MarkListColumn.ItemName)"
					>
						{{ row.props.row.itemName }}
						<pen-icon
							class="mark-list__edit-icon"
							@click="onEditField(row.props.row, MarkListColumn.ItemName)"
						/>
						<smm-tooltip
							v-if="!row.props.row.isIncluded"
							trigger="hover"
							content-teleport-to=".tooltip-content"
						>
							<template #activator>
								<ui-icon
									id="doc-cross"
									class="mark-list__doc-icon"
								/>
							</template>
							<template #content>Код исключен из УПД</template>
						</smm-tooltip>
					</div>
					<div
						class="mark-list__col mark-list__col_state"
						:style="getColumnStyles(MarkListColumn.StateId)"
					>
						<div class="mark-list__status">
							<smm-status :mod="DIGITAL_MARK_STATE_MODIFIERS[row.props.row.stateId as DigitalMarkState]">
								{{ DIGITAL_MARK_STATE_TEXT[row.props.row.stateId as DigitalMarkState] }}
							</smm-status>
						</div>
					</div>
					<div
						class="mark-list__col mark-list__col_code"
						:style="getColumnStyles(MarkListColumn.ShortCode)"
					>
						<div class="mark-list__code">
							<smm-tooltip
								placement="top-start"
								trigger="click"
								class="mark-list__tooltip"
							>
								<template #activator>
									<smm-text>{{ (row.props.row.shortCode ?? '').slice(0, 60) }}</smm-text>
								</template>
								<template #content>
									<div class="mark-list__tooltip-content">
										<smm-text>
											{{ row.props.row.shortCode }}
										</smm-text>
										<copy-icon @click="onCopyCode(row.props.row.shortCode)" />
									</div>
								</template>
							</smm-tooltip>
							<pen-icon
								class="mark-list__edit-icon"
								@click="onEditField(row.props.row, MarkListColumn.ShortCode)"
							/>
						</div>
						<div
							v-if="row.props.row.hasErrors"
							class="mark-list__error"
						>
							<attention-icon />
							<smm-text tag="p">КМ не найден в ЧЗ</smm-text>
						</div>
						<div
							v-if="row.props.row.isProcessing"
							class="mark-list__attention"
						>
							<time-icon />
							<smm-text tag="p">Код на проверке</smm-text>
						</div>
					</div>
					<div
						class="mark-list__col"
						:style="getColumnStyles(MarkListColumn.OfferId)"
					>
						{{ row.props.row.offerId }}
					</div>
					<div
						class="mark-list__col"
						:style="getColumnStyles(MarkListColumn.MerchantId)"
					>
						<div class="mark-list__merchant">
							<smm-text tag="p">{{ getMerchantName(row.props.row.merchantId) }}</smm-text>
							<smm-text
								class="mark-list__additional"
								tag="p"
							>
								{{ row.props.row.merchantId }}, ИНН {{ getMerchantInn(row.props.row.merchantId) }}
							</smm-text>
						</div>
					</div>
					<div
						v-if="isColumnActive(MarkListColumn.GroupId)"
						class="mark-list__col"
						:style="getColumnStyles(MarkListColumn.GroupId)"
					>
						{{ getCategoryName(row.props.row.groupId) }}
					</div>
					<div
						v-if="isColumnActive(MarkListColumn.BaseEntityExternalId)"
						class="mark-list__col"
						:style="getColumnStyles(MarkListColumn.BaseEntityExternalId)"
					>
						{{ row.props.row.baseEntityExternalId }}
					</div>
					<div
						v-if="isColumnActive(MarkListColumn.OwnerInn)"
						class="mark-list__col"
						:style="getColumnStyles(MarkListColumn.OwnerInn)"
					>
						{{ row.props.row.ownerInn ?? '' }}
					</div>
					<div
						v-if="isColumnActive(MarkListColumn.FullCode)"
						class="mark-list__col mark-list__col_short-code"
						:style="getColumnStyles(MarkListColumn.FullCode)"
					>
						<smm-tooltip
							placement="top-start"
							trigger="click"
							class="mark-list__tooltip"
						>
							<template #activator>
								<smm-text>{{ (row.props.row.fullCode ?? '').slice(0, 60) }}</smm-text>
							</template>
							<template #content>
								<div class="mark-list__tooltip-content">
									<smm-text>
										{{ row.props.row.fullCode }}
									</smm-text>
									<copy-icon @click="onCopyCode(row.props.row.fullCode)" />
								</div>
							</template>
						</smm-tooltip>
						<pen-icon
							class="mark-list__edit-icon"
							@click="onEditField(row.props.row, MarkListColumn.FullCode)"
						/>
					</div>
				</div>
			</template>
			<template #no-result>
				<div class="mark-list__no-result">
					<smm-text
						class="mark-list__no-result-title"
						tag="p"
						size="xl"
						weight="bold"
					>
						По вашему запросу ничего не найдено
					</smm-text>
					<smm-text
						tag="p"
						size="lg"
					>
						Проверьте, что вы верно ввели номер поставки.
					</smm-text>
				</div>
			</template>
			<template
				v-if="digitalMarkTotal > limitOptions[0]"
				#footer
			>
				<div class="mark-list__pagination">
					<smm-pagination
						v-if="digitalMarkTotal > limit"
						:offset="offset"
						:total="digitalMarkTotal"
						:limit="limit"
						:link-creator="linkCreator"
						@change="onPageChange"
					/>
					<smm-select
						v-model="limit"
						name="mark-list-limit"
						mod="context-text"
						size="md"
						dropdown-position="top-right"
						:options="selectLimitOptions"
						@change="onLimitChange"
					/>
				</div>
			</template>
		</smm-table>
		<mark-list-selected-items-popup
			v-if="selectedRows.length"
			:count="selectedRows.length"
			@close="selectedRows = []"
			@check="onCheckCodes"
			@exclude="onExcludeDigitalMarks"
			@delete="onDeleteDigitalMarks"
		/>
		<mark-list-edit-col-modal
			:title="getColTitle(selectedField)"
			:is-opened="isEditModalOpened"
			:model-value="selectedFieldValue"
			@update:model-value="onUpdateCol"
			@close="onCloseUpdateModal"
		/>
		<ui-modal-confirm
			:is-opened="isConfirmDeletingModalOpened"
			:title="deleteModalTitle"
			:text="deleteModalText"
			accept-label="Удалить"
			reject-label="Назад"
			@accept="onConfirmDeleting"
			@close="onRejectDeleting"
		/>
		<ui-modal-confirm
			:is-opened="isConfirmExcludingModalOpened"
			:title="excludeModalTitle"
			:text="excludeModalText"
			accept-label="Исключить"
			reject-label="Назад"
			@accept="onConfirmExcluding"
			@close="onRejectExcluding"
		/>
	</div>
</template>

<style scoped lang="scss">
.mark-list {
	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}

	&__search-wrapper {
		flex-grow: 1;
	}

	&__input {
		max-width: 400px;
	}

	&__total {
		color: $smm-color-neutral-500;
	}

	&__download-button {
		:deep(svg) {
			width: 16px;
			height: 16px;
		}
	}

	&__table {
		:deep(.smm-table-cell-row) {
			padding: 16px 12px;
		}

		:deep(.smm-table-cell-row-header[data-column-name='offer-id']) {
			min-width: 120px;
			max-width: 120px;
		}
	}

	&__merchant {
		word-break: break-word;
	}

	&__additional {
		margin-top: 2px;
		font-size: $smm-font-size-sm;
		color: $smm-color-neutral-500;
	}

	&__tooltip {
		:deep(.smm-tooltip__content) {
			max-width: 450px;
			color: $smm-color-neutral-900;
			background-color: $smm-color-white;
			box-shadow: 0 4px 20px 0 rgb(0 0 0 / 10%);
		}
	}

	&__tooltip-content {
		display: flex;
		gap: 8px;

		:deep(svg) {
			width: 16px;
			min-width: 16px;
			height: 16px;
			min-height: 16px;
			color: $smm-color-primary;
			cursor: pointer;
		}
	}

	&__delete-icon {
		color: $smm-color-primary;
		cursor: pointer;
	}

	&__errors-button {
		align-items: flex-start;
	}

	&__pagination {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 24px;
		gap: 16px;
		border-top: 1px solid $smm-color-neutral-200;
	}

	&__settings {
		max-width: 36px;

		:deep(.smm-button__content svg) {
			width: 16px;
			height: 16px;
		}
	}

	&__merchant {
		word-break: break-word;
	}

	&__additional {
		margin-top: 2px;
		font-size: $smm-font-size-sm;
		color: $smm-color-neutral-500;
	}

	&__error,
	&__attention {
		display: flex;
		align-items: center;
		margin-top: 4px;
		gap: 8px;
		font-size: $smm-font-size-sm;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	&__error {
		color: $smm-color-error-500;
	}

	&__attention {
		color: $smm-color-moderate-500;
	}

	&__status {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	&__edit-icon {
		width: 16px;
		min-width: 16px;
		height: 16px;
		min-height: 16px;
		color: $smm-color-primary;
		cursor: pointer;
	}

	&__doc-icon {
		width: 24px;
		min-width: 24px;
		height: 24px;
		min-height: 24px;
		color: $smm-color-neutral-500;
	}

	&__row {
		display: flex;
		padding: 0 10px;

		&_error {
			background-color: #fff7f6;
		}

		&_warn {
			background-color: #fffcf1;
		}
	}

	&__col {
		flex-shrink: 0;
		padding: 16px 12px;
		overflow: hidden;

		&_state {
			display: flex;
			justify-content: flex-end;
			align-items: flex-start;
		}

		&_code {
			word-break: break-all;
		}

		&_name {
			display: flex;
			gap: 4px;
			word-break: break-word;

			.mark-list__edit-icon {
				width: 24px;
				min-width: 24px;
				height: 24px;
				min-height: 24px;
				color: $smm-color-primary;
				cursor: pointer;
			}
		}

		&_short-code {
			display: flex;
			gap: 4px;
			word-break: break-all;
		}
	}

	&__tooltip {
		:deep(.smm-tooltip__content) {
			max-width: 450px;
			color: $smm-color-neutral-900;
			background-color: $smm-color-white;
			box-shadow: 0 4px 20px 0 rgb(0 0 0 / 10%);
		}
	}

	&__tooltip-content {
		display: flex;
		gap: 8px;
		word-break: break-all;

		:deep(svg) {
			width: 16px;
			min-width: 16px;
			height: 16px;
			min-height: 16px;
			color: $smm-color-primary;
			cursor: pointer;
		}
	}

	&__code {
		display: flex;
		gap: 4px;
	}

	&__no-result {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 300px;
	}

	&__no-result-title {
		margin-bottom: 12px;
	}
}
</style>
