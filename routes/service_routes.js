const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service_controller');

router.get('/', serviceController.getAllServices);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.post('/bookings', serviceController.createBooking); // маршрут для записей на прием

module.exports = router;