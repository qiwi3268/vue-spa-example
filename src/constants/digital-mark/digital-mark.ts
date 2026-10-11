import type { SmmStatusMod } from 'ui';

import type { ISelectOption } from '@/composable/pagination';

export enum DigitalMarkState {
	Emitted = 0,
	Applied = 0,
	Introduced = 0,
	WrittenOff = 0,
	Retired = 0,
	Withdrawn = 0,
	Disaggregation = 0,
	Disaggregated = 0,
	AppliedNotPaid = 0,
}

export const DIGITAL_MARK_STATE_OPTIONS: ISelectOption[] = [
	{ value: DigitalMarkState.Emitted, label: 'Эмитирован' },
	{ value: DigitalMarkState.Applied, label: 'Нанесён' },
	{ value: DigitalMarkState.Introduced, label: 'В обороте' },
	{ value: DigitalMarkState.WrittenOff, label: 'Списан' },
	{ value: DigitalMarkState.Retired, label: 'Выбыл' },
	{ value: DigitalMarkState.Disaggregation, label: 'Расформирован' },
	{ value: DigitalMarkState.AppliedNotPaid, label: 'Не оплачен' },
];

export const DIGITAL_MARK_STATE_MODIFIERS: Record<DigitalMarkState, SmmStatusMod> = {
	[DigitalMarkState.Emitted]: 'draft',
	[DigitalMarkState.Applied]: 'draft',
	[DigitalMarkState.Introduced]: 'approved',
	[DigitalMarkState.WrittenOff]: 'cancellation',
	[DigitalMarkState.Retired]: 'cancellation',
	[DigitalMarkState.Withdrawn]: 'cancellation',
	[DigitalMarkState.Disaggregation]: 'cancellation',
	[DigitalMarkState.Disaggregated]: 'cancellation',
	[DigitalMarkState.AppliedNotPaid]: 'cancellation',
};

export const DIGITAL_MARK_STATE_TEXT: Record<DigitalMarkState, string> = {
	[DigitalMarkState.Emitted]: 'Эмитирован',
	[DigitalMarkState.Applied]: 'Нанесён',
	[DigitalMarkState.Introduced]: 'В обороте',
	[DigitalMarkState.WrittenOff]: 'Списан',
	[DigitalMarkState.Retired]: 'Выбыл',
	[DigitalMarkState.Withdrawn]: 'Выбыл',
	[DigitalMarkState.Disaggregation]: 'Расформирован',
	[DigitalMarkState.Disaggregated]: 'Расформирован',
	[DigitalMarkState.AppliedNotPaid]: 'Не оплачен',
};

export enum DigitalMarkCategory {
	Clothes = 0,
	Shoes = 0,
	Tobacco = 0,
	Perfumery = 0,
	Tires = 0,
	Cameras = 0,
	Dairy = 0,
	Medicine = 0,
	TobaccoAlt = 0,
	Water = 0,
	Fur = 0,
	Beer = 0,
	Nicotine = 0,
	BAA = 0,
	Antiseptics = 0,
	Seafood = 0,
}

export const DIGITAL_MARK_CATEGORY_OPTIONS: ISelectOption[] = [
	{ value: DigitalMarkCategory.Clothes, label: 'Одежда и текстиль' },
	{ value: DigitalMarkCategory.Shoes, label: 'Обувь' },
	{ value: DigitalMarkCategory.Tobacco, label: 'Табак' },
	{ value: DigitalMarkCategory.Perfumery, label: 'Парфюмерия' },
	{ value: DigitalMarkCategory.Tires, label: 'Шины' },
	{ value: DigitalMarkCategory.Cameras, label: 'Фотокамеры' },
	{ value: DigitalMarkCategory.Dairy, label: 'Молочная продукция' },
	{ value: DigitalMarkCategory.Medicine, label: 'Медицинские изделия' },
	{ value: DigitalMarkCategory.TobaccoAlt, label: 'Табак (альтернатива)' },
	{ value: DigitalMarkCategory.Water, label: 'Упакованная вода' },
	{ value: DigitalMarkCategory.Fur, label: 'Товары из меха' },
	{ value: DigitalMarkCategory.Beer, label: 'Пиво и слабоалкогольные' },
	{ value: DigitalMarkCategory.Nicotine, label: 'Никотиносодержащая продукция' },
	{ value: DigitalMarkCategory.BAA, label: 'БАД' },
	{ value: DigitalMarkCategory.Antiseptics, label: 'Антисептики' },
	{ value: DigitalMarkCategory.Seafood, label: 'Морепродукты' },
];

export enum MarkDocumentTab {
	IncomingDoc = 'Входящие УПД',
	OutgoingDoc = 'Исходящие УПД',
}

export enum EDocumentDirection {
	In = 'in',
	Out = 'out',
}

