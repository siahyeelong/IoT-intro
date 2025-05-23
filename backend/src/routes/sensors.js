import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

// get all sensors
router.get('/', async (req, res) => {
    const { rows } = await query('SELECT id, name, room_id, ST_AsGeoJson(St_transform(geom,4326)) geom FROM sensors');
    res.send(rows);
});

// insert sensor record
router.post('/', async (req, res) => {
    const { body } = req;
    if (body.name === undefined || body.room_id === undefined) {
        res.sendStatus(400);
    } else {
        await query('INSERT INTO sensors (name, room_id) VALUES ($1, $2)', [body.name, body.room_id]);
        res.sendStatus(200);
    }
});

// get sensor by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { rows } = await query('SELECT id, name, room_id, ST_AsGeoJson(St_transform(geom,4326)) geom FROM sensors WHERE id = $1', [id]);
    if (rows.length === 0) {
        res.sendStatus(404);
        return;
    }
    res.send(rows[0]);
});

// delete sensor by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sensors WHERE id = $1', [id]);
    res.sendStatus(200);
});

export { router as default };
