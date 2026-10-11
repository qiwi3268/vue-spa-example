import HttpService from '@/services/http-service';
import FileApi from '@/services/api/file';
import DigitalMarkApi from '@/services/api/digital-mark/digital-mark';

export * from '@/services/api/file';
export * from '@/services/api/digital-mark/digital-mark';

interface IApiServiceOptions {
	httpService: HttpService;
}

export interface IFileResponse {
	blob: Blob;
	name: string;
}

export enum ProcessingResult {
	Processing = 'processing',
	Processed = 'processed',
	Error = 'error',
}

export interface IReportGetResponse {
	requestId: string;
}

export const DEFAULT_ERROR = 'Произошла техническая ошибка. Попробуйте повторить позднее.';

export const isUseMocks = false;

export default class ApiService {
	readonly file;
	readonly digitalMark;

	constructor({ httpService }: IApiServiceOptions) {
		this.file = new FileApi(httpService);
		this.digitalMark = new DigitalMarkApi(httpService);
	}
}
