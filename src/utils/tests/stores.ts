import type { Store, StoreDefinition } from 'pinia';
import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';

import { createServices } from '@/services';

export type StoreType<StoreDefinitionType> = StoreDefinitionType extends StoreDefinition<
	infer A,
	infer B,
	infer C,
	infer D
>
	? Store<A, B, C, D>
	: never;

export const configurePinia = (): void => {
	const { apiService } = createServices();
	const app = createApp({});
	const pinia = createPinia().use(() => ({ apiService }));
	app.use(pinia);
	setActivePinia(pinia);
};
