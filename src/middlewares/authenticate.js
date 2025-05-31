import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Session } from '../models/session.model.js';
import { User } from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Not authorized');
    }

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid token');
    }

    const session = await Session.findOne({
      userId: payload.userId,
      accessToken: token,
    });

    if (!session) {
      throw createHttpError(401, 'Invalid session');
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
