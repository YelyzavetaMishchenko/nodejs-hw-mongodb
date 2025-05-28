import { Contact } from '../models/contact.model.js';

export const findAllContacts = async () => {
  return await Contact.find();
};

export const findContactById = async (id) => {
  return await Contact.findById(id);
};

export const addContact = async (data) => {
  return await Contact.create(data);
};

export const updateContactById = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContactById = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
