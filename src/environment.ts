// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRuntimeEnvironment {

}

const DEFAULT_RUNTIME_ENVIRONMENT: Readonly<Partial<IRuntimeEnvironment>> = {};

/* Служебные переменные окружения. */
export const serviceEnvironment = {
};

/* Статичные переменные окружения. */
export const staticEnvironment = {
};

export type Environment = Readonly<typeof serviceEnvironment & typeof staticEnvironment & Partial<IRuntimeEnvironment>>;

const environment: Environment = {
	...serviceEnvironment,
	...staticEnvironment,
};

export const addToEnvironment = (data = DEFAULT_RUNTIME_ENVIRONMENT): void => {
	Object.assign(environment, data);
};

export default environment;
