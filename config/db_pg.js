const { Pool } = require('pg');

const pgPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pawcare_db',
    password: '1111',
    port: 5432,
});

module.exports = pgPool;