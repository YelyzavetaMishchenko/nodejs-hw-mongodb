import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.service.js';

import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

export const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw createHttpError(400, error.message);
  }

  const newUser = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

export const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw createHttpError(400, error.message);
  }

  const { accessToken, refreshToken, refreshTokenValidUntil } = await loginUser(
    req.body,
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken,
    },
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken, newRefreshToken, refreshTokenValidUntil } =
    await refreshSession(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken,
    },
  });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  await logoutUser(refreshToken);

  res.status(204).end();
};
