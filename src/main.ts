import type Keycloak from 'keycloak-js'
import type { KeycloakInitOptions } from 'keycloak-js'
import { createPinia } from 'pinia'
import { type Component, type App as IApp, createApp } from 'vue'

import { createKeycloak, setKeycloakInstance } from '@/app/auth/keycloak-client'
import App from '@/app.vue'
import { useAuthentication } from '@/composable/auth'
import { useKeycloak } from '@/composable/keycloak'
import { environment } from '@/environment.js'
import { router } from '@/router'
import { createServices } from '@/services'

import 'ui/build/styles/index.css'
import 'ui/build/index.css'

const initOptions: KeycloakInitOptions = {
	onLoad: 'login-required',
	pkceMethod: 'S256',
	checkLoginIframe: false,
}
const { setKeycloak } = useAuthentication()

async function initKeycloak(app: IApp): Promise<Keycloak | void> {
	const keycloak = createKeycloak({
		url: environment.KEYCLOAK_URL,
		realm: environment.KEYCLOAK_REALM,
		clientId: environment.KEYCLOAK_CLIENT_ID,
	})

	setKeycloakInstance(keycloak)

	try {
		const { initialize } = useKeycloak()

		// Вызываем инициализацию, тут устанавливается канал
		const cleanup = initialize()

		await keycloak.init(initOptions)

		setKeycloak(keycloak)

		// Сохраняем функцию очистки, если понадобится
		app.provide('keycloakCleanup', cleanup)

		app.use(router)
	} catch {
		/* empty */
	}
}

async function configureApp(app: IApp): Promise<void> {
	const services = createServices()

	Object.entries(services).forEach(([key, value]) => app.provide(key, value))

	await initKeycloak(app)

	app.use(router).use(createPinia())
}

async function initApp(): Promise<void> {
	const app = createApp(App as Component)
	await configureApp(app)
	app.mount('#app')
}

void initApp()
