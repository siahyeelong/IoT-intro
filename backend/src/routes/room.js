import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

// get room by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT id, name, capacity, building_id, ST_AsGeoJson(St_transform(geom,4326)) geom FROM rooms WHERE id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows[0]);
});

// insert room record
router.post('/', async (req, res) => {
  const { body } = req;
  if (body.name === undefined || body.building_id === undefined || body.capacity === undefined) {
    res.sendStatus(400);
  } else {
    await query('INSERT INTO rooms (name, building_id, capacity) VALUES ($1, $2, $3)', [body.name, body.building_id, body.capacity]);
    res.sendStatus(200);
  }
});

// delete room by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('DELETE FROM rooms WHERE id = $1', [id]);
  res.sendStatus(200);
});

// get all sensors in room by id
router.get('/:id/sensors', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT sensors.id, sensors.name, room_id, ST_AsGeoJson(St_transform(geom,4326)) geom FROM sensors INNER JOIN rooms ON sensors.room_id = rooms.id WHERE rooms.id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows);
});

export { router as default };
