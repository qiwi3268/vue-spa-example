import IMask from 'imask';

export const positiveIntegerMaskSettings = {
	mask: Number,
	scale: 0,
	signed: false,
	min: 0,
	overwrite: true,
};

export const positiveIntegerMask = IMask.createPipe(positiveIntegerMaskSettings);
