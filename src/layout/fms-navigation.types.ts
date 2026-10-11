import type { RouteLocationNamedRaw } from 'vue-router';

export enum NavSectionId {
	DigitalMark = 'digitalMark',
	MarkList = 'markList',
}

export interface INavListItem {
	name: string;
	id: NavSectionId;
	route?: RouteLocationNamedRaw;
	isSelected?: boolean;
	isAvailable?: boolean;
	icon?: string;
	children?: INavListItem[];
}
