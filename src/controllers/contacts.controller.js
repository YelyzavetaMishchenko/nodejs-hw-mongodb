import createHttpError from 'http-errors';
import { Contact } from '../models/contact.model.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id });

  res.status(200).json({
    status: 200,
    message: 'Successfully found all contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.contactId,
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found a contact!',
    data: { contact },
  });
};

export const createContact = async (req, res) => {
  const { name, email, phoneNumber, isFavourite, contactType } = req.body;

  let photo = '';
  if (req.file?.path) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'contacts',
    });
    photo = uploadResult.secure_url;
  }

  const newContact = await Contact.create({
    name,
    email,
    phoneNumber,
    isFavourite,
    contactType,
    photo,
    userId: req.user._id,
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
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  if (req.file?.path) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'contacts',
    });
    contact.photo = uploadResult.secure_url;
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
    { _id: req.params.contactId, userId: req.user._id },
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
    userId: req.user._id,
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
