import { JwtPayload } from 'jsonwebtoken';

export class ValidationError extends Error {
	public statusCode: number;
	public name: string;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'ValidationError';
		this.statusCode = statusCode;
	}
}

export interface ProductItem {
	_id?: string;
	title: string;
	image: string;
	price: number;
	description: string;
	quantity?: number;
}
