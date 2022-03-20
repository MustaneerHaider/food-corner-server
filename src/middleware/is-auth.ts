import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../lib/auth';
import { ValidationError } from '../lib/model';

const isAuth: RequestHandler = (req, _, next) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		const error = new ValidationError('Not authorized!', 401);
		throw error;
	}

	// token will only exist if the user is logged in
	const authToken = (authHeader as string).split(' ')[1];

	// verify the token
	let decodedToken;
	try {
		decodedToken = verifyToken(
			authToken,
			process.env.JWT_SECRET!
		) as JwtPayload;
	} catch (err: any) {
		err.statusCode = 500;
		throw err;
	}

	if (!decodedToken) {
		const error = new ValidationError('Not authorized!', 401);
		throw error;
	}

	req.userId = decodedToken.userId;
	next();
};

export default isAuth;
