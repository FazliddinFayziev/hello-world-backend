
const Joi = require('joi');

const validate = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });


const JoiSchema = Joi.object({
    name: Joi.string().min(2).required(),
    category: Joi.string().min(2).required(),
    price: Joi.number().min(0).required(),
    descuz: Joi.string().min(2).required(),
    descru: Joi.string().min(2).required(),
    desceng: Joi.string().min(2).required(),
    size: Joi.array().items(Joi.string()).required(),
});

exports.validateProduct = validate(JoiSchema)