import { Contact } from '../models/contact.model.js';
import createHttpError from 'http-errors';

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id });
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findOne({
    _id: contactId,
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Not found');
  }

  res.json(contact);
};

export const createContact = async (req, res) => {
  const newContact = await Contact.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(newContact);
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Not found');
  }

  res.json({ message: 'Contact deleted' });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;

  const updated = await Contact.findOneAndUpdate(
    { _id: contactId, userId: req.user._id },
    req.body,
    { new: true },
  );

  if (!updated) {
    throw createHttpError(404, 'Not found');
  }

  res.json(updated);
};

export const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;

  const updated = await Contact.findOneAndUpdate(
    { _id: contactId, userId: req.user._id },
    req.body,
    { new: true },
  );

  if (!updated) {
    throw createHttpError(404, 'Not found');
  }

  res.json(updated);
};
