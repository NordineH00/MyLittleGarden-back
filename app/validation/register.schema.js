const Joi = require('joi');

module.exports = Joi.object({

  user_name: Joi.string()
    .alphanum()
    .min(3)
    .max(20),

  firstname: Joi.string()
    .min(3)
    .max(20),

  lastname: Joi.string()
    .min(3)
    .max(20),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr', 'io'] } }),

  password: Joi.string()
    // eslint-disable-next-line prefer-regex-literals
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  confirm_password: Joi.ref('password'),

  new_password: Joi.string()
  // eslint-disable-next-line prefer-regex-literals
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

}).required();
