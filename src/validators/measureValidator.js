const { body, query } = require('express-validator');
const { MEASURE_TYPES } = require('../helpers/constants')

const validateMeasure = [
    body('customer_code').isString().withMessage('O id do usuário deve ser uma string'),
    body('measure_type').isString().withMessage('O tipo de medida deve ser uma string')
    .custom(value => {
        if (!MEASURE_TYPES.includes(value)) {
            throw new Error('O tipo de medida deve ser "WATER" ou "GAS"');
        }
        return true;
    }),
    body('measure_datetime').matches(/^\d{4}\/\d{2}\/\d{4} ([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('A data não está em um formato valido (DD/MM/YYYY HH:MM)'),
    body('image').custom(value => {
        return Buffer.from(value.replace(/^data:image\/\w+;base64,/, ''), 'base64').toString('base64') === value.replace(/^data:image\/\w+;base64,/, '');
    }).withMessage('A imagem deve ser uma string base64 válida')
];

const validateConfirmMeasure = [
    body('measure_uuid').isString().withMessage('O id da medição deve ser uma string'),
    body('confirmed_value').isInt().withMessage('O valor de confirmação deve ser um inteiro'),
]

const validateFilter = [
    query('measure_type').isString().withMessage('O tipo de medida deve ser uma string')
    .custom(value => {
        if (!MEASURE_TYPES.includes(value)) {
            throw new Error('O tipo de medida deve ser "WATER" ou "GAS"');
        }
        return true;
    }),
]

module.exports = { validateMeasure, validateConfirmMeasure, validateFilter };
