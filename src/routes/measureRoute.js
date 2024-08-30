const express = require('express');
const router = express.Router();
const { getAllMeasures, createMeasure, getMeasure, confirmMeasure, getCustomerList } = require('../controllers/measureController');
const { validateMeasure, validateConfirmMeasure, validateFilter } = require('../validators/measureValidator');

router.get('/measures', getAllMeasures);
router.get('/measures/:id', getMeasure);
router.post('/measures', validateMeasure, createMeasure);
router.patch('/confirm', validateConfirmMeasure, confirmMeasure);
router.get('/:customer_code/list', validateFilter, getCustomerList);

module.exports = router;
