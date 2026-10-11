import { computed, ComputedRef, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';

import { LIMIT_OPTIONS } from '@/constants';
import type { LimitOption } from '@/constants';

export interface ISelectOption<T = number | string> {
	label: string;
	value: T;
}

export interface IChangePaginationParams {
	limit: number;
	offset: number;
}

export interface IPagination {
	limitOptions: number[];
	limit: Ref<number>;
	offset: Ref<number>;
	selectLimitOptions: ComputedRef<ISelectOption[]>;
	changeLimit: (value: string | number | null) => void;
	changePage: (page: number, offsetValue: number, event: Event) => void;
	parseUrlPaginationParams: () => void;
	linkCreator: ComputedRef<(page: number) => string>;
}

const usePagination = (initialLimit: LimitOption | number = LIMIT_OPTIONS[0]): IPagination => {
	const route = useRoute();

	const limit = ref<number>(initialLimit);

	const offset = ref(0);

	const selectLimitOptions = computed((): ISelectOption[] =>
		LIMIT_OPTIONS.map(value => ({
			value,
			label: `${value} на странице`,
		})),
	);

	const linkCreator = computed(
		(): ((page: number) => string) => page =>
			`${window.location.pathname}?${new URLSearchParams({
				...route.query,
				limit: `${limit.value}`,
				page: `${page}`,
			}).toString()}`,
	);

	function changeLimit(value: string | number | null): void {
		if (typeof value !== 'number') {
			return;
		}

		limit.value = value;
		offset.value = 0;
	}

	function changePage(page: number, offsetValue: number, event: Event): void {
		const target = event.target as HTMLLinkElement;
		target.blur();
		window.scrollTo(0, 0);
		offset.value = offsetValue;
	}

	function parseUrlPaginationParams(): void {
		if (route.query.limit) {
			const queryLimit = +route.query.limit;
			if (Number.isInteger(queryLimit) && LIMIT_OPTIONS.includes(queryLimit as LimitOption)) {
				limit.value = queryLimit;
			}
		}

		if (route.query.page) {
			const queryPage = +route.query.page;
			if (Number.isInteger(queryPage) && queryPage > 0) {
				offset.value = (queryPage - 1) * limit.value;
			}
		}
	}

	return {
		limitOptions: LIMIT_OPTIONS,
		limit,
		offset,
		selectLimitOptions,
		linkCreator,
		changeLimit,
		changePage,
		parseUrlPaginationParams,
	};
};

export default usePagination;
