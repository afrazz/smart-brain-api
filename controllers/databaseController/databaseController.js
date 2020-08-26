// Postgres
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

// Redis
const redis = require('redis');
const redisClient = redis.createClient({host: '192.168.99.100'});

module.exports = {
    db,
    redisClient
}