
const Joi = require('joi');

const validate = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

// Validation of Product

const JoiSchema = Joi.object({
    name: Joi.string().min(2).required(),
    category: Joi.string().min(2).required(),
    price: Joi.number().min(0).required(),
    colors: Joi.array().items(Joi.string()).required(),
    option: Joi.string().min(2).required(),
    descuz: Joi.string().min(2).required(),
    descru: Joi.string().min(2).required(),
    desceng: Joi.string().min(2).required(),
    size: Joi.array().items(Joi.string()).required(),
    imageUrls: Joi.array().items(Joi.string()),
});

// Validation of Banner

const JoiSchemaBanner = Joi.object({
    text: Joi.string().min(2).required(),
    link: Joi.string().min(2).required(),
    number: Joi.string().min(0).required(),
    category: Joi.string().min(2).required(),
    imageUrls: Joi.array().items(Joi.string()),
});


// Validation of Card

const JoiSchemaCard = Joi.object({
    cardItems: Joi.array().required(),
    totalPrice: Joi.number().min(0).required(),
    time: Joi.string().min(2),
    userInfo: [
        Joi.object({
            userName: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            avenue: Joi.string().required(),
            address: Joi.string().required()
        }).required()
    ]
});

// Validate QRCODE

const JoiSchemaQRCode = Joi.object({
    logoLetter: Joi.string().required().max(2),
    text: Joi.string().min(0).required(),
    smallText: Joi.string().min(0).required(),
    icons: [
        Joi.object({
            instagram: Joi.string(),
            telegram: Joi.string(),
            facebook: Joi.string(),
            twitter: Joi.string(),
            github: Joi.string(),
            linkedIn: Joi.string(),
            website: Joi.string(),
            youtube: Joi.string(),
        }).required()
    ]
});


// Validate Notes

const JoiSchemaNotes = Joi.object({
    text: Joi.string().min(2).required(),
    time: Joi.string().min(2).required(),
});

// Validate User
const JoiSchemaUser = Joi.object({
    userName: Joi.string().min(2).required(),
    password: Joi.string().min(2).required(),
});




exports.validateProduct = validate(JoiSchema);
exports.validateCard = validate(JoiSchemaCard);
exports.validateUser = validate(JoiSchemaUser);
exports.validateNotes = validate(JoiSchemaNotes);
exports.validateBanner = validate(JoiSchemaBanner);
exports.validateQRCode = validate(JoiSchemaQRCode);