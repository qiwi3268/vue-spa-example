import Keycloak from 'keycloak-js';

export interface IAuthentication {
	token: string;
	setKeycloakToken: (token: string) => void;
	setKeycloak: (keycloak: Keycloak) => void;
	getUserName: () => string;
	getUserPreferredUsername: () => string;
	logout: () => void;
	hasRole: (userRoles: Role[] | Role) => boolean;
	canViewDigitalMark: () => boolean;
	canEditDigitalMark: () => boolean;
}

export enum Role {
	DigitalMarkViewer = 'VIEWER',
	DigitalMarkAdmin = 'ADMIN',

}

let token = '';

let keycloak: Keycloak | null = null;
let roles: string[] = [];

const useAuthentication = (): IAuthentication => {
	function setKeycloakToken(value: string): void {
		token = value;
	}

	function setKeycloak(value: Keycloak): void {
		keycloak = value;
		roles = keycloak?.tokenParsed?.resource_access?.['']?.roles ?? [];
	}

	function getUserName(): string {
		return keycloak?.tokenParsed?.name ?? '';
	}

	function getUserPreferredUsername(): string {
		return keycloak?.tokenParsed?.preferred_username ?? '';
	}

	function logout(): void {
		keycloak?.logout();
	}

	function hasRole(userRoles: Role[] | Role): boolean {
		return roles.some(role =>
			(Array.isArray(userRoles) ? userRoles : [userRoles]).some(item => role.includes(item.replace('-', ''))),
		);
	}

	function canViewDigitalMark(): boolean {
		return hasRole([Role.DigitalMarkViewer, Role.DigitalMarkAdmin]);
	}

	function canEditDigitalMark(): boolean {
		return roles.some(role => role.includes(Role.DigitalMarkAdmin));
	}


	return {
		token,
		setKeycloakToken,
		setKeycloak,
		getUserName,
		getUserPreferredUsername,
		logout,
		hasRole,
		canViewDigitalMark,
		canEditDigitalMark,
	};
};

export default useAuthentication;
