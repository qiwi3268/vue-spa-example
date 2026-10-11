export * from '@/utils/tests';
export * from '@/utils/auth';
export * from '@/utils/masks';
export * from '@/utils/api';

export const isClickWithoutSpecialKeys = (e: MouseEvent) => {
	if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) {
		return false;
	}

	if (e.button !== undefined && e.button !== 0) {
		return false;
	}

	return true;
};
