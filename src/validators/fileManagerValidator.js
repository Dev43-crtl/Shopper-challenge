const { body } = require('express-validator');
const { MEASURE_TYPES } = require('../helpers/constants');

const validateUpload = [
    body('customer_code')
        .isString()
        .withMessage('O código do usuário é obrigatório deve ser uma string'),
    body('measure_type')
        .isString()
        .withMessage('O tipo de medida deve ser uma string')
        .custom(value => {
            if (!MEASURE_TYPES.includes(value)) {
                throw new Error('O tipo de medida deve ser "WATER" ou "GAS"');
            }
            return true;
        }),
    body('measure_datetime')
        .exists()
        .withMessage('O campo "datetime" é obrigatório.')
        .isString()
        .withMessage('O campo "datetime" deve ser uma string.')
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
        .withMessage('O formato da data e hora deve ser yyyy-mm-dd hh:mm.'),
    body('image').custom(value => {
        return Buffer.from(value.replace(/^data:image\/\w+;base64,/, ''), 'base64').toString('base64') === value.replace(/^data:image\/\w+;base64,/, '');
    }).withMessage('A imagem deve ser uma string base64 válida')
];

module.exports = validateUpload;
