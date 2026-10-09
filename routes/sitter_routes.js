const express = require('express');
const router = express.Router();
const sitterController = require('../controllers/sitter_controller');

router.get('/', sitterController.getAllSitters);
router.post('/', sitterController.createSitter);
router.put('/:id', sitterController.updateSitter);
router.delete('/:id', sitterController.deleteSitter);

module.exports = router;