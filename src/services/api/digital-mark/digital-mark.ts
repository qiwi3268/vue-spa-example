import {
	type ISmmTableSort,
} from 'ui';
import { DigitalMarkCategory, DigitalMarkState } from '@/constants/digital-mark/digital-mark';

import HttpService from '@/services/http-service';
import { isUseMocks } from '@/services/api-service';
import mocks from '@/services/api/mocks';

import type { IMarkListFilter } from '@/stores/digital-mark/digital-mark';
import { ConsignmentDirection } from '@/stores/facility/throughput';

export enum DigitalMarkSort {
	OfferId = 'offerId',
	StateId = 'stateId',
	MerchantId = 'merchantId',
	BaseEntityExternalId = 'baseEntityExternalId',
}

export interface IDigitalMarkListRequest {
	filter: IMarkListFilter;
	limit: number;
	offset: number;
	sort: ISmmTableSort;
}

export interface IDigitalMarkListResponse {
	total: number;
	digitalMarks: IDigitalMarkModel[];
}

export interface IDigitalMarkModel {
	id: number;
	offerId: string;
	itemName: string;
	merchantId: number;
	stateId: DigitalMarkState | null | '';
	ownerInn: string | null;
	groupId: DigitalMarkCategory | null | '';
	shortCode: string | null;
	fullCode: string | null;
	baseEntityExternalId: string;
	isProcessing?: boolean;
	isIncluded?: boolean;
	hasErrors?: boolean;
	errors?: string[];
}

export interface ICheckDigitalMarksRequest {
	digitalMarkIds: number[];
}

export interface IUpdateDigitalMarkRequest {
	digitalMarks: {
		digitalMarkId: number;
		itemName?: string;
		stateId?: DigitalMarkState;
		shortCode?: string;
		fullCode?: string;
	}[];
}

export interface IExcludeDigitalMarksRequest {
	direction: ConsignmentDirection;
	digitalMarkIds: number[];
}

export default class DigitalMarkApi {
	constructor(private httpService: HttpService) {}

	getList(data: IDigitalMarkListRequest): Promise<IDigitalMarkListResponse> {
		if (isUseMocks) {
			return mocks.digitalMark.getList();
		}

		return this.httpService.post('/api', data);
	}

	checkCodes(data: ICheckDigitalMarksRequest): Promise<void> {
		return this.httpService.post('/api', data);
	}

	updateDigitalMark(data: IUpdateDigitalMarkRequest): Promise<void> {
		return this.httpService.post('/api', data);
	}

	deleteDigitalMarks(data: ICheckDigitalMarksRequest): Promise<void> {
		return this.httpService.post('/api', data);
	}

	excludeDigitalMarks(data: IExcludeDigitalMarksRequest): Promise<void> {
		return this.httpService.post('/api', data);
	}
}
