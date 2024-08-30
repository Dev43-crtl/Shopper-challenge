const express = require('express');
const router = express.Router();
const { uploadImage, getImage } = require('../controllers/fileManagerController');
const validateUpload = require('../validators/fileManagerValidator');

router.post('/upload', validateUpload, uploadImage);
router.get('/uploads/:uuid', getImage);

module.exports = router;
