import Joi from 'joi';

export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  contactType: Joi.string().valid('home', 'personal').required(),
  isFavourite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(3).max(20),
  contactType: Joi.string().valid('home', 'personal'),
  isFavourite: Joi.boolean(),
}).or('name', 'email', 'phoneNumber', 'contactType', 'isFavourite');
