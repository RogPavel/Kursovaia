const pgPool = require('../config/db_pg');

exports.getAllServices = async (req, res) => {
    try {
        const result = await pgPool.query('SELECT * FROM services ORDER BY id');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createService = async (req, res) => {
    try {
        const { name, description, price, icon } = req.body;
        const query = 'INSERT INTO services (name, description, price, icon) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pgPool.query(query, [name, description, price, icon || '🐾']);
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, icon } = req.body;
        const query = 'UPDATE services SET name = $1, description = $2, price = $3, icon = $4 WHERE id = $5';
        await pgPool.query(query, [name, description, price, icon, id]);
        res.json({ message: 'Услуга успешно обновлена' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteService = async (req, res) => {
    try {
        await pgPool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
        res.json({ message: 'Услуга удалена' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createBooking = async (req, res) => {
    try {
        const { owner_name, phone, pet_name, service_name, booking_date } = req.body;
        const query = `
            INSERT INTO bookings (owner_name, phone, service_type, pet_name, booking_date)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pgPool.query(query, [owner_name, phone, service_name, pet_name, booking_date || null]);
        res.status(201).json({ message: 'Запись успешно сохранена' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};