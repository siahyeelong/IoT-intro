import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

// get all buildings
router.get('/', async (req, res) => {
  const { rows } = await query('SELECT id, name, ST_AsGeoJson(St_transform(geom,4326)) geom FROM buildings');
  res.send(rows);
});

export { router as default };
