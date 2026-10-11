import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import { getKeycloak } from '@/app/auth/keycloak-client'
import type { NotificationService } from '@/services/notification-service'

export const enum HttpServiceMethod {
	Post = 'post',
	Get = 'get',
}

export interface IApiResponse<T = unknown> {
	data?: T
	value?: T
	error?: { code?: string; message?: string; description?: string }
	errorDetails?: { code?: string; description?: string }
	blob?: Blob
	name?: string
	success?: number
	details: unknown
}

export interface IFileResponse {
	blob: Blob
	name: string
}

export const HEADERS = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'X-Requested-With': 'XMLHttpRequest',
}

export const DEFAULT_ERROR = 'Техническая ошибка. Перезагрузите страницу и попробуйте ещё раз'
export const REQUEST_TIMEOUT = 60000

let axiosInstance: AxiosInstance | undefined

export class HttpService {
	constructor(private readonly notificationService: NotificationService) {
		if (!axiosInstance) {
			axiosInstance = axios.create({
				headers: HEADERS,
				timeout: REQUEST_TIMEOUT,
			})
			this.configureInterceptors()
		}
	}

	configureInterceptors(): void {
		axiosInstance?.interceptors.request.use(
			async (config) => {
				const method = config.method?.toLowerCase() as HttpServiceMethod

				const keycloak = getKeycloak()
				if (keycloak.isTokenExpired(30)) {
					await keycloak.updateToken(30).catch(() => keycloak.logout())
				}
				const { token } = keycloak

				if (token) {
					config.headers.Authorization = `Bearer ${token}`
				}

				if (config.data instanceof FormData) {
					config.headers['Content-Type'] = 'multipart/form-data'
				} else if (method === HttpServiceMethod.Post) {
					config.data = {
						meta: { from: 'fulfilment-management-system' },
						data: { ...config.data } as unknown,
					}
				}

				return Promise.resolve(config)
			},
			// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- обработчик ошибок на вход получает объект или строку
			(error: AxiosError<Error>) => Promise.reject(error.response),
		)

		axiosInstance?.interceptors.response.use(
			(response: AxiosResponse<IApiResponse | BlobPart | IFileResponse>) => {
				const data = response.data as IApiResponse
				const contentType: string | undefined = response.headers['content-type'] as string | undefined
				if (contentType?.includes('application/json')) {
					if (data.success && data.data) {
						return Promise.resolve(data.data) as Promise<AxiosResponse<IApiResponse>>
					}

					if (data.error) {
						// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- обработчик ошибок на вход получает объект или строку
						return Promise.reject(data.error)
					}

					this.notificationService.error(DEFAULT_ERROR)
					// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- обработчик ошибок на вход получает объект или строку
					return Promise.reject(data.details ? data.details : DEFAULT_ERROR)
				}

				const nameMatches = /filename[^;=\n]*=(utf-8(['"]*))?(.*)/.exec(
					String(response.headers['content-disposition']) || '',
				)

				const fileResponse = response.data as BlobPart
				return Promise.resolve({
					blob: new Blob([fileResponse], { type: response.headers['content-type'] as string | undefined }),
					name: nameMatches?.[3] ? decodeURIComponent(nameMatches[3].replace(/['"]/g, '')) : '',
				}) as unknown as Promise<AxiosResponse<IFileResponse>>
			},
			// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- обработчик ошибок на вход получает объект или строку
			(error: AxiosError) => Promise.reject(error.response),
		)
	}

	post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		return (
			(axiosInstance?.post(url, data, config) as Promise<T> | undefined) ?? Promise.reject(new Error(DEFAULT_ERROR))
		)
	}
}
