import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContactById,
  deleteContactById,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(patchContactById));
router.delete('/:contactId', ctrlWrapper(deleteContactById));

export default router;
