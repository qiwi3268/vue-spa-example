import { smmNotify as notify } from 'ui';

export const NOTIFICATION_Z_INDEX = 10099;

interface INotificationParams {
	title: string;
	text?: string;
}

export default class NotificationService {
	error(params: string | INotificationParams): void {
		let text;
		let title;

		if (typeof params === 'string') {
			text = params;
		} else {
			text = params.text;
			title = params.title;
		}

		notify({
			text,
			title,
			type: 'error',
			zIndex: NOTIFICATION_Z_INDEX,
		});
	}

	success(params: string | INotificationParams): void {
		let text;
		let title;

		if (typeof params === 'string') {
			text = params;
		} else {
			text = params.text;
			title = params.title;
		}

		notify({
			text,
			title,
			type: 'success',
			zIndex: NOTIFICATION_Z_INDEX,
		});
	}

	info(params: string | INotificationParams): void {
		let text;
		let title;

		if (typeof params === 'string') {
			text = params;
		} else {
			text = params.text;
			title = params.title;
		}

		notify({
			text,
			title,
			type: 'info',
			zIndex: NOTIFICATION_Z_INDEX,
		});
	}

	warning(params: string | INotificationParams): void {
		let text;
		let title;

		if (typeof params === 'string') {
			text = params;
		} else {
			text = params.text;
			title = params.title;
		}

		notify({
			text,
			title,
			type: 'warning',
			zIndex: NOTIFICATION_Z_INDEX,
		});
	}
}
