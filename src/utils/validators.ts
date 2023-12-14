import mongoose from 'mongoose';
import validator from 'validator';
import { celebrate } from 'celebrate';
import Joi from 'joi';

export const urlValidationOptions = {
  validator: (v: string) => validator.isURL(v),
  message: (props: mongoose.ValidatorProps) => `${props.value} is not a valid URL!`,
};

export const emailValidationOptions = {
  validator: (v: string) => validator.isEmail(v),
  message: (props: mongoose.ValidatorProps) => `${props.value} email is not valid!`,
};

const joiUrlValidator = (value: any, helpers: Joi.CustomHelpers) => {
  if (!validator.isURL(value)) {
    return helpers.error('string.url');
  }
  return value;
};

const joiEmailValidator = (value: any, helpers: Joi.CustomHelpers) => {
  if (!validator.isEmail(value)) {
    return helpers.error('string.email');
  }
  return value;
};

export const signUpValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().custom(joiEmailValidator),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom(joiUrlValidator),
  }),
});

export const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

export const profileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(joiUrlValidator).required(),
  }),
});

export const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(joiUrlValidator),
  }),
});

export const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
