const Sitter = require('../models/sitter_model');

exports.getAllSitters = async (req, res) => {
    try { res.json(await Sitter.find()); } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createSitter = async (req, res) => {
    try {
        const newSitter = new Sitter(req.body);
        await newSitter.save();
        res.status(201).json(newSitter);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.updateSitter = async (req, res) => {
    try {
        const { name, experience, bio, rating, avatar } = req.body;
        await Sitter.findByIdAndUpdate(req.params.id, { name, experience, bio, rating, avatar });
        res.json({ message: 'Данные сиделки обновлены' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteSitter = async (req, res) => {
    try {
        await Sitter.findByIdAndDelete(req.params.id);
        res.json({ message: 'Сиделка успешно удалена' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};