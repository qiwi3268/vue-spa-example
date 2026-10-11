export enum IMcssErrorCode {
	Test = ''
}

export interface IMcssError {
	code: IMcssErrorCode;
	description: string;
}

export const isMcssError = (error: unknown): error is IMcssError =>
	(error as IMcssError).code === IMcssErrorCode.Test && typeof (error as IMcssError).description === 'string';
