import Keycloak from 'keycloak-js';

import { useNotificationService } from '@/services';

// eslint-disable-next-line import/prefer-default-export
export function updateToken(keycloak: Keycloak, onUpdateCallback: () => void) {
	const notificationService = useNotificationService();

	setInterval(() => {
		keycloak
			.updateToken(70)
			.then((refreshed: boolean) => {
				if (refreshed) {
					onUpdateCallback();
				}
			})
			.catch(() => {
				notificationService.error('Ошибка при обновлении токена');
			});
	}, 10000);
}
