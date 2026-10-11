import 'pinia';

import ApiService from '@/services/api-service';

declare module 'pinia' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface PiniaCustomProperties {
		apiService: ApiService;
	}
}
