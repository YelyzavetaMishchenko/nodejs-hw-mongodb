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
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const pageNumber = parseInt(page);
  const limit = parseInt(perPage);
  const skip = (pageNumber - 1) * limit;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sort = { [sortBy]: sortDirection };

  const filter = { userId: req.user._id };
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);
  const contacts = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: pageNumber,
      perPage: limit,
      totalItems,
      totalPages,
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
    },
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findOne({
    _id: contactId,
    userId: req.user._id,
  });

  if (!result) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Success',
    data: result,
  });
};

export const createContact = async (req, res) => {
  let photo = '';
  if (req.file?.path) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'contacts',
    });
    photo = uploadResult.secure_url;
  }

  const result = await Contact.create({
    ...req.body,
    photo,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: result,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findOne({
    _id: contactId,
    userId: req.user._id,
  });

  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: null,
    });
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
    message: 'Contact updated successfully',
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
  const { contactId } = req.params;

  const result = await Contact.findOneAndDelete({
    _id: contactId,
    userId: req.user._id,
  });

  if (!result) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(204).send();
};
