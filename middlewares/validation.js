const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validatelink = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат URL');
  }
  return value;
};

module.exports.validatyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validatyAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validatelink).required(),
  }),
});

module.exports.validatyUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required()
      .alphanum(),
  }),
});

module.exports.validatyCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .alphanum(),
  }),
});

module.exports.validatyCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(validatelink).required(),
  }),
});

module.exports.validatySigUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validatelink),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

module.exports.validatySigIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});
