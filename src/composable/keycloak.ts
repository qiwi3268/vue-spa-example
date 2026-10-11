import { ref } from 'vue'

import { getKeycloak } from '@/app/auth/keycloak-client'

interface IAuthTokens {
	token?: string
	refreshToken?: string
	idToken?: string
}

interface IKeycloakOptions {
	onTokensChange?: (tokens: IAuthTokens) => void
}

interface IUpdateTokenEvent {
	token: string
	refreshToken: string
	idToken: string
	type: string
}

export function useKeycloak({ onTokensChange }: IKeycloakOptions = {}) {
	const isLoading = ref(true)
	const authChannel = ref<BroadcastChannel | null>(null)
	const keycloakInstance = getKeycloak()

	const handleTokens = () => {
		const tokens: IAuthTokens = {
			token: keycloakInstance.token || undefined,
			refreshToken: keycloakInstance.refreshToken || undefined,
			idToken: keycloakInstance.idToken || undefined,
		}

		onTokensChange?.(tokens)

		if (authChannel.value) {
			authChannel.value.postMessage({ type: 'tokenUpdate', ...tokens })
		}
	}

	const handleRefreshToken = async () => {
		try {
			const refreshed = await keycloakInstance.updateToken(30)
			if (refreshed) {
				handleTokens()
			}
		} catch {
			/* empty */
		}
	}

	function setupKeycloakEvents(): void {
		keycloakInstance.onReady = () => {
			isLoading.value = false

			if (authChannel.value) {
				authChannel.value.postMessage({ type: 'setMaster' })
			}
		}
		keycloakInstance.onAuthSuccess = handleTokens
		keycloakInstance.onAuthRefreshSuccess = handleTokens
		keycloakInstance.onAuthLogout = handleTokens
		keycloakInstance.onTokenExpired = handleRefreshToken
	}

	function setupBroadcastChannel(): void {
		authChannel.value = new BroadcastChannel('keycloak-auth')
	}

	function handleBroadcastChannelMessage(event: MessageEvent<IUpdateTokenEvent>): void {
		if (event.data.type === 'tokenUpdate') {
			keycloakInstance.token = event.data.token
			keycloakInstance.refreshToken = event.data.refreshToken
			keycloakInstance.idToken = event.data.idToken

			onTokensChange?.({
				token: event.data.token,
				refreshToken: event.data.refreshToken,
				idToken: event.data.idToken,
			})
		}

		if (event.data.type === 'setMaster') {
			keycloakInstance.onTokenExpired = null as unknown as undefined
		}
	}

	// Функция для ручной инициализации (вызывается в main.ts)
	const initialize = () => {
		// Подписываемся на события Keycloak
		setupKeycloakEvents()

		// Создаем канал для общения между вкладками
		setupBroadcastChannel()

		// Обработчик сообщений от других вкладок
		authChannel.value?.addEventListener('message', handleBroadcastChannelMessage)

		// Функция для очистки
		return () => {
			if (authChannel.value) {
				authChannel.value.removeEventListener('message', handleBroadcastChannelMessage)
				authChannel.value.close()
			}
		}
	}

	const cleanup = () => {
		if (authChannel.value) {
			authChannel.value.close()
			authChannel.value = null
		}
	}

	return {
		isLoading,
		keycloak: keycloakInstance,
		initialize,
		cleanup,
	}
}
