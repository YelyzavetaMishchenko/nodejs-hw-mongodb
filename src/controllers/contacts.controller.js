import { Contact } from '../models/contact.model.js';

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

  const filter = {};
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
  const result = await Contact.findById(contactId);
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
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(204).send(); // No Content
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
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
    message: 'Contact updated successfully',
    data: result,
  });
};
