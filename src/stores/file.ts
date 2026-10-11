import { defineStore } from 'pinia';
import { saveFile } from 'utils';

import { MILLISECONDS_IN_SECOND } from '@/constants';
import useMcssErrorHandler from '@/composable/mcss-error';

import { DEFAULT_ERROR, ProcessingResult } from '@/services/api-service';
import { useApiService, useNotificationService } from '@/services';

import useSystemStore from '@/stores/system';

const useFileStore = defineStore('file', () => {
	const systemStore = useSystemStore();

	const apiService = useApiService();
	const notificationService = useNotificationService();
	const mcssErrorHandler = useMcssErrorHandler();

	async function getFile(operationId: string, fileName?: string): Promise<void> {
		try {
			systemStore.startLoading();
			const { result } = await apiService.file.checkFile({
				operationId,
			});

			switch (result) {
				case ProcessingResult.Processing:
					systemStore.startLoading();
					setTimeout(() => {
						getFile(operationId, fileName);
						systemStore.finishLoading();
					}, 3 * MILLISECONDS_IN_SECOND);
					break;
				case ProcessingResult.Processed:
					downloadFile(operationId, fileName);
					break;
				case ProcessingResult.Error:
					notificationService.error(DEFAULT_ERROR);
					break;
				default:
					break;
			}
		} catch (error) {
			mcssErrorHandler.handle(error);
		} finally {
			systemStore.finishLoading();
		}
	}

	async function downloadFile(operationId: string, fileName?: string): Promise<void> {
		try {
			systemStore.startLoading();
			const { blob, name } = await apiService.file.getFile({
				operationId,
			});

			saveFile(blob, fileName ?? name);
		} catch (error) {
			mcssErrorHandler.handle(error);
		} finally {
			systemStore.finishLoading();
		}
	}

	return {
		getFile,
	};
});

export default useFileStore;
