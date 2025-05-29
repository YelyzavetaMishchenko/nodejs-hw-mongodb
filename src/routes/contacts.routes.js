import express from 'express';
import * as ctrl from '../controllers/contacts.controller.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  addContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

const router = express.Router();

router.get('/', ctrlWrapper(ctrl.getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(ctrl.getContactById));

router.post(
  '/',
  validateBody(addContactSchema),
  ctrlWrapper(ctrl.createContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(ctrl.deleteContact));

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(ctrl.updateContact),
);

export default router;
