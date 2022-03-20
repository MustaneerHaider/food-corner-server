import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string) => {
	return bcrypt.hash(password, 12);
};

export const comparePassword = async (
	hashedPassword: string,
	password: string
) => {
	return bcrypt.compare(password, hashedPassword);
};

export const getToken = (payload: object) => {
	return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const verifyToken = (token: string, secret: string) => {
	return jwt.verify(token, secret);
};
