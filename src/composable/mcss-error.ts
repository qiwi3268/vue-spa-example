import { isMcssError } from '@/utils';

import { DEFAULT_ERROR } from '@/services/api-service';
import { useNotificationService } from '@/services';

export interface IMcssErrorHandler {
	handle: (error: unknown) => void;
}

const useMcssErrorHandler = (): IMcssErrorHandler => {
	const notificationService = useNotificationService();

	function handle(error: unknown): void {
		if (isMcssError(error)) {
			notificationService.error(error.description);
		} else {
			notificationService.error(DEFAULT_ERROR);
		}
	}

	return {
		handle,
	};
};

export default useMcssErrorHandler;
