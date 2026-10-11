import HttpService from '@/services/http-service';
import { type IFileResponse, ProcessingResult } from '@/services/api-service';

export interface ICheckFileParams {
	operationId: string;
}

export interface ICheckFileResponse {
	result: ProcessingResult;
}

export default class FileApi {
	constructor(private httpService: HttpService) {}

	checkFile(data: ICheckFileParams): Promise<ICheckFileResponse> {
		return this.httpService.post('/api/', data);
	}

	getFile(data: ICheckFileParams): Promise<IFileResponse> {
		return this.httpService.post('/api/', data, { responseType: 'blob' });
	}
}
