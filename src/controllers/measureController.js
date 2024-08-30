const MeasureService = require('../services/measureService');
const measureService = new MeasureService();
const { validationResult } = require('express-validator');

measureService.init();

const getAllMeasures = async (req, res, next) => {
    try {
        const measures = await measureService.getAllMeasures();
        res.json(measures);
    }catch(err) {
        next(err)
    }
};

const getMeasure = async (req, res, next) => {
    const measure_uuid = parseInt(req.params.id);
    try {
        const measure = await measureService.getMeasure(measure_uuid);
        res.json(measure);
    }catch(err) {
        next(err)
    }
};

const createMeasure = async (req, res, next) => {
    const { measure_value, measure_type, measure_datetime, image_url, customer_code } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error_code: "INVALID_DATA",
            error_description: errors.array() 
        });
    }

    try {
        const measure = await measureService.createMeasure(
            measure_value,
            measure_type, 
            measure_datetime, 
            customer_code, 
            image_url
        );
        
        res.json(measure);
    }catch(err) {
        next(err)
    }
};

const confirmMeasure = async (req, res, next) => {
    const { measure_uuid, confirmed_value  } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error_code: "INVALID_DATA",
            error_description: errors.array() 
        });
    }
    

    try{
        const isConfirmed = await measureService.confirmMeasure(measure_uuid, confirmed_value);
        if(!isConfirmed) {
            return res.status(404).json({ 
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura do mês já realizada",
            });
        }

        return res.status(200).json({"success": true});
    }catch(err) {
        next(err);
    }
}

const getCustomerList = async (req, res, next) => {
    const { customer_code  } = req.params;
    const measure_type = req.query.measure_type ?? null;

    if(measure_type) {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error_code: "INVALID_TYPE",
                error_description: "“Tipo de medição não permitida"
            });
        }
    }
    
    try{
        const customerList = await measureService.getCustomerList(customer_code, measure_type);
        if(customerList.length < 1) {
            return res.status(400).json({ 
                error_code: "MEASURES_NOT_FOUND",
                error_description: "Nenhuma leitura encontrada"
            });
        }

        return res.status(200).json({ customer_code: customer_code ,measures : customerList });
    }catch(err) {
        next(err);
    }
}

module.exports = {
    getAllMeasures,
    createMeasure,
    getMeasure,
    confirmMeasure,
    getCustomerList
};