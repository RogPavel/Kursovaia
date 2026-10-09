const mongoose = require('mongoose');

const sitterSchema = new mongoose.Schema({
    name: String,
    experience: String,
    bio: String,
    rating: { type: Number, default: 0 }, // Изменено со String на Number
    avatar: String
});

module.exports = mongoose.model('Sitter', sitterSchema);