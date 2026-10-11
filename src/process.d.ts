declare module 'process' {
	global {
		namespace NodeJS {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			interface ProcessEnv {
				[key: string]: string;
			}
		}
	}
}
