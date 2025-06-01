import express from 'express';
import * as ctrl from '../controllers/contacts.controller.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  addContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from '../schemas/contactsSchemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(ctrl.getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(ctrl.getContactById));

router.post(
  '/',
  validateBody(addContactSchema),
  ctrlWrapper(ctrl.createContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(ctrl.deleteContact));

router.put(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(ctrl.updateContact),
);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateStatusSchema),
  ctrlWrapper(ctrl.updateStatusContact),
);

export default router;
