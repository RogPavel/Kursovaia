const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet_controller');

router.get('/', petController.getAllPets);
router.post('/', petController.createPet);
router.put('/:id', petController.updatePet);
router.delete('/:id', petController.deletePet);

module.exports = router;