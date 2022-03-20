import { RequestHandler } from 'express';

import User from '../models/user';
import { ValidationError } from '../lib/model';
import { comparePassword, getToken, hashPassword } from '../lib/auth';

export const postSignup: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body as { email: string; password: string };

	if (!email || !email.includes('@') || !password || password.length < 6) {
		const err = new ValidationError('Credentials are missing.', 422);
		throw err;
	}

	try {
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			const err = new ValidationError(
				'A user with this email already exists.',
				422
			);
			throw err;
		}

		const hashedPassword = await hashPassword(password);
		const createdUser = await User.create({
			email,
			password: hashedPassword
		});

		res.status(201).json({
			message: 'User created.',
			userId: createdUser._id
		});
	} catch (err) {
		next(err);
	}
};

export const postLogin: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body as { email: string; password: string };

	if (!email || !email.includes('@') || !password || password.length < 6) {
		const err = new ValidationError('Credentials are missing.', 422);
		throw err;
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			const err = new ValidationError('Invalid email or password.', 422);
			throw err;
		}

		const isEqual = await comparePassword(user.password, password);
		if (!isEqual) {
			const err = new ValidationError('Invalid email or password.', 422);
			throw err;
		}

		const token = getToken({
			userId: user._id.toString(),
			email: user.email
		});

		res.status(200).json({
			tokenId: token,
			userId: user._id.toString(),
			expiresIn: 604800,
			isAdmin: user.isAdmin
		});
	} catch (err) {
		next(err);
	}
};
