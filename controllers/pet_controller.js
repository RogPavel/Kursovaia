const Pet = require('../models/pet_model');

exports.getAllPets = async (req, res) => {
    try { res.json(await Pet.find()); } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createPet = async (req, res) => {
    try {
        const newPet = new Pet(req.body);
        await newPet.save();
        res.status(201).json(newPet);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// МАКСИМАЛЬНО НАДЕЖНОЕ ОБНОВЛЕНИЕ ЧЕРЕЗ .save()
exports.updatePet = async (req, res) => {
    try {
        // Находим питомца по ID
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ error: 'Питомец не найден' });
        }

        // Если в запросе пришли новые name или breed, принудительно обновляем их в документе
        if (req.body.name !== undefined) pet.name = req.body.name;
        if (req.body.breed !== undefined) pet.breed = req.body.breed;

        // Сохраняем обновленный документ в MongoDB
        await pet.save();

        res.json({ message: 'Кличка и порода успешно обновлены в MongoDB', pet });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePet = async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Питомец удален' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};