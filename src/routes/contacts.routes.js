import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from '../schemas/contactsSchemas.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  updateStatusContact,
  deleteContact,
} from '../controllers/contacts.controller.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  upload.single('photo'),
  validateBody(addContactSchema),
  ctrlWrapper(createContact),
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateStatusSchema),
  ctrlWrapper(updateStatusContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
