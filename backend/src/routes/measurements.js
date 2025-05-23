import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

// get all measurements
router.get('/', async (req, res) => {
    const { rows } = await query('SELECT id, sensor_id, value, timestamp FROM measurements');
    res.send(rows);
});

// insert measurement record
router.post('/', async (req, res) => {
    const { body } = req;
    if (body.sensor_id === undefined || body.value === undefined || body.timestamp === undefined) {
        res.sendStatus(400);
    } else {
        await query('INSERT INTO measurements (sensor_id, value, timestamp) VALUES ($1, $2, $3)', [body.sensor_id, body.value, body.timestamp]);
        res.sendStatus(200);
    }
});

export { router as default };