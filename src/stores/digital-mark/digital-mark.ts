import { defineStore } from 'pinia';
import { ref } from 'vue';

import { DigitalMarkCategory, DigitalMarkState } from '@/constants/digital-mark/digital-mark';

import { useApiService } from '@/services';
import type { IDigitalMarkListRequest, IDigitalMarkModel } from '@/services/api/digital-mark/digital-mark';
import type { IMerchantInfo } from '@/services/api/merchant';

import { ConsignmentDirection } from '@/stores/facility/throughput';

export interface IMarkListFilter {
	stateIds: DigitalMarkState[];
	merchantId?: number | null;
	baseEntityExternalId?: string;
	groupIds: DigitalMarkCategory[];
	hasErrors?: boolean;
}

const useDigitalMarkStore = defineStore('digital-mark', () => {
	const apiService = useApiService();

	const digitalMarkList = ref<IDigitalMarkModel[]>([]);
	const digitalMarkTotal = ref<number>(0);
	const merchantList = ref<IMerchantInfo[]>([]);

	async function fetchDigitalMarkList({ filter, limit, offset, sort }: IDigitalMarkListRequest): Promise<void> {
		const { total, digitalMarks } = await apiService.digitalMark.getList({
			filter: {
				stateIds: filter.stateIds,
				merchantId: filter.merchantId ? filter.merchantId : undefined,
				baseEntityExternalId: filter.baseEntityExternalId ? filter.baseEntityExternalId : undefined,
				groupIds: filter.groupIds,
				hasErrors: filter.hasErrors ? filter.hasErrors : undefined,
			},
			limit,
			offset,
			sort,
		});

		digitalMarkTotal.value = total;
		digitalMarkList.value = digitalMarks;

		const merchantIds = digitalMarks.map(item => item.merchantId);

		if (merchantIds.length) {
			const response = await apiService.merchant.getMerchantsInfo({ merchantIds });
			merchantList.value = response.merchantLegalPersonInfo;
		} else {
			merchantList.value = [];
		}
	}

	async function checkDigitalMarks(digitalMarkIds: number[]): Promise<void> {
		return apiService.digitalMark.checkCodes({ digitalMarkIds });
	}

	async function updateDigitalMarkItemName(digitalMarkId: number, itemName: string): Promise<void> {
		return apiService.digitalMark.updateDigitalMark({
			digitalMarks: [
				{
					digitalMarkId,
					itemName,
				},
			],
		});
	}

	async function updateDigitalMarkShortCode(digitalMarkId: number, shortCode: string): Promise<void> {
		return apiService.digitalMark.updateDigitalMark({
			digitalMarks: [
				{
					digitalMarkId,
					shortCode,
				},
			],
		});
	}

	async function updateDigitalMarkFullCode(digitalMarkId: number, fullCode: string): Promise<void> {
		return apiService.digitalMark.updateDigitalMark({
			digitalMarks: [
				{
					digitalMarkId,
					fullCode,
				},
			],
		});
	}

	async function deleteDigitalMarks(digitalMarkIds: number[]): Promise<void> {
		return apiService.digitalMark.deleteDigitalMarks({
			digitalMarkIds,
		});
	}

	async function excludeDigitalMarks(digitalMarkIds: number[]): Promise<void> {
		return apiService.digitalMark.excludeDigitalMarks({
			direction: ConsignmentDirection.In,
			digitalMarkIds,
		});
	}

	function clearDigitalMarkList(): void {
		digitalMarkTotal.value = 0;
		digitalMarkList.value = [];
		merchantList.value = [];
	}

	return {
		digitalMarkList,
		digitalMarkTotal,
		merchantList,
		fetchDigitalMarkList,
		checkDigitalMarks,
		updateDigitalMarkItemName,
		updateDigitalMarkShortCode,
		updateDigitalMarkFullCode,
		deleteDigitalMarks,
		excludeDigitalMarks,
		clearDigitalMarkList,
	};
});

export default useDigitalMarkStore;
