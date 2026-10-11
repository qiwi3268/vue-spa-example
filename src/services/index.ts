import { inject } from 'vue';

import NotificationService from '@/services/notification-service';
import HttpService from '@/services/http-service';
import ApiService from '@/services/api-service';

export const createServices = () => {
	const notificationService = new NotificationService();
	const httpService = new HttpService(notificationService);
	const apiService = new ApiService({ httpService });

	return {
		notificationService,
		httpService,
		apiService,
	};
};

export const useNotificationService = () => inject('notificationService') as NotificationService;
export const useApiService = () => inject('apiService') as ApiService;
