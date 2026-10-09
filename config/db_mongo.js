const mongoose = require('mongoose');

const connectMongoDB = () => {
    mongoose.connect('mongodb://localhost:27017/pawcare_db')
        .then(() => console.log('MongoDB: Успешное подключение к pawcare_db'))
        .catch(err => console.error('MongoDB Error:', err));
};

module.exports = connectMongoDB;