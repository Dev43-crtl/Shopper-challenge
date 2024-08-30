const { validationResult } = require('express-validator');
const FileManagerService = require('../services/fileManagerService');
const fileManagerService = new FileManagerService();
const MeasureService = require('../services/measureService');
const measureService = new MeasureService();
const path = require('path');
const fs = require('fs');

const uploadImage  = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error_code: "INVALID_DATA",
            error_description: errors.array() 
        });
    }

    const { customer_code, measure_type, measure_datetime, image } = req.body;

    try {

        const hasDoubleReport = await measureService.validateDoubleReport(
            customer_code, 
            measure_type, 
            measure_datetime, 
        )

        if(hasDoubleReport.total != 0){
            return res.status(409).json({ 
                error_code: "DOUBLE_REPORT",
                error_description: "A leitura do mês ja foi realizada" 
            });
        }

        const tempUrl = await fileManagerService.handleImage(image, customer_code, measure_datetime, measure_type);
 
        let measure = await measureService.createMeasure(
            tempUrl.measure_value, 
            measure_type, 
            measure_datetime, 
            customer_code, 
            tempUrl.image_url
        );

        res.json({
                image_url: tempUrl.image_url,
                measure_value: tempUrl.measure_value,
                measure_uuid: measure
            });
    }catch(err) {
        next(err);
    }
};

const getImage = (req, res) => {
    const rootDir = path.dirname(require.main.filename);
    const filePath = path.join(rootDir, 'assets/uploads', `${req.params.uuid}.png`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        return res.status(404).send('Arquivo não encontrado');
    }
};


module.exports = { uploadImage , getImage };