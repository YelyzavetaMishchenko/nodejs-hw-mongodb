import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.controller.js';

import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

import {
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../schemas/usersSchemas.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/refresh', ctrlWrapper(refresh));
router.post('/logout', ctrlWrapper(logout));

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmail),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPassword),
);

export default router;
