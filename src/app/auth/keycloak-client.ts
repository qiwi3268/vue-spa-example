import Keycloak from 'keycloak-js'

let keycloakInstance: Keycloak | null = null

export function createKeycloak(config: { url: string; realm: string; clientId: string }): Keycloak {
	if (keycloakInstance) {
		return keycloakInstance
	}

	keycloakInstance = new Keycloak(config)
	return keycloakInstance
}

export function getKeycloak(): Keycloak {
	if (!keycloakInstance) {
		throw new Error('Keycloak not initialized.')
	}
	return keycloakInstance
}

export function setKeycloakInstance(instance: Keycloak): void {
	keycloakInstance = instance
}
