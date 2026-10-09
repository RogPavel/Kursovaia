const express = require('express');
const cors = require('cors');
const path = require('path');

// Подключаем конфиги баз данных
const connectMongoDB = require('./config/db_mongo');
connectMongoDB();

// Подключаем роуты
const authRoutes = require('./routes/auth_routes');
const serviceRoutes = require('./routes/service_routes');
const petRoutes = require('./routes/pet_routes');
const sitterRoutes = require('./routes/sitter_routes');

// Подключаем напрямую контроллер сервисов для точечного маппинга bookings
const serviceController = require('./controllers/service_controller');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Раздача статических файлов фронтенда из папки public
app.use(express.static(path.join(__dirname, 'public')));

// --- Маршруты страниц (Фронтенд HTML) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});
app.get('/contacts.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contacts.html'));
});

// --- API маршруты (Бэкенд) ---
app.use('/api/auth', authRoutes);       // Запросы пойдут на /api/auth/register и /api/auth/login
app.use('/api/services', serviceRoutes); // Услуги (PostgreSQL)
app.use('/api/pets', petRoutes);         // Питомцы (MongoDB)
app.use('/api/sitters', sitterRoutes);   // Сиделки (MongoDB)

// Исправление конфликта путей: перенаправляем запрос фронтенда напрямую в метод контроллера
app.post('/api/bookings', serviceController.createBooking);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер успешно запущен на http://localhost:${PORT}`);
});