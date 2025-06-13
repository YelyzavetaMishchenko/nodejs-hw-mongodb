import createHttpError from 'http-errors';
import { Contact } from '../models/contact.model.js';

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find({ owner: req.user._id });

  res.status(200).json({
    status: 200,
    message: 'Successfully found all contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.contactId,
    owner: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found a contact!',
    data: { contact }, // ✅ исправлено по фидбеку
  });
};

export const createContact = async (req, res) => {
  const { name, email, phoneNumber, isFavourite, contactType } = req.body;
  const photo = req.file?.path || '';

  const newContact = await Contact.create({
    name,
    email,
    phoneNumber,
    isFavourite,
    contactType,
    photo,
    owner: req.user._id, // ✅ поле owner как userId
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.contactId,
    owner: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  if (req.file?.path) {
    contact.photo = req.file.path;
  }

  const { name, email, phoneNumber, isFavourite, contactType } = req.body;

  if (name !== undefined) contact.name = name;
  if (email !== undefined) contact.email = email;
  if (phoneNumber !== undefined) contact.phoneNumber = phoneNumber;
  if (isFavourite !== undefined) contact.isFavourite = isFavourite;
  if (contactType !== undefined) contact.contactType = contactType;

  await contact.save();

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: contact,
  });
};

export const updateStatusContact = async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.contactId, owner: req.user._id },
    { isFavourite: req.body.isFavourite },
    { new: true },
  );

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated the contact status!',
    data: contact,
  });
};

export const deleteContact = async (req, res) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.contactId,
    owner: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted a contact!',
    data: contact,
  });
};
