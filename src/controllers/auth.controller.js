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
    status: 'success',
    message: 'Successfully registered a user!',
    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
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

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: refreshTokenValidUntil,
    })
    .status(200)
    .json({
      status: 'success',
      message: 'Successfully logged in!',
      data: {
        accessToken,
      },
    });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is required');
  }

  const { accessToken, newRefreshToken, refreshTokenValidUntil } =
    await refreshSession(refreshToken);

  res
    .cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      expires: refreshTokenValidUntil,
    })
    .status(200)
    .json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is required');
  }

  await logoutUser(refreshToken);

  res.clearCookie('refreshToken').status(204).end();
};
