import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

// get all rooms
router.get('/', async (req, res) => {
  const { rows } = await query('SELECT id, name, capacity, building_id, ST_AsGeoJson(St_transform(geom,4326)) geom FROM rooms');
  res.send(rows);
});

export { router as default };
