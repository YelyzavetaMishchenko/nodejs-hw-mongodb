import Joi from 'joi';

export const addContactSchema = Joi.object({
  name: Joi.string().trim().required(),
  phoneNumber: Joi.string().trim().required(),
  email: Joi.string().trim().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim(),
  phoneNumber: Joi.string().trim(),
  email: Joi.string().trim().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);

export const updateStatusSchema = Joi.object({
  isFavourite: Joi.boolean().required(),
});
