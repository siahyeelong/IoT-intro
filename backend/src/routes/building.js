import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

// get building by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT id, name, ST_AsGeoJson(St_transform(geom,4326)) geom FROM buildings WHERE id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows[0]);
});

// insert building record
router.post('/', async (req, res) => {
  const { body } = req;
  if (body.name === undefined) {
    res.sendStatus(400);
  } else {
    await query('INSERT INTO buildings (name) VALUES ($1)', [body.name]);
    res.sendStatus(200);
  }
});

// update building geometry by id
/**
 * Sample request body:
{
  "id": 5,
  "geom": {
    "type": "Polygon",
    "coordinates": [
      [
        [4.871218, 45.780758],
        [4.871453, 45.780803],
        [4.871935, 45.779769],
        [4.871692, 45.779722],
        [4.871218, 45.780758]
      ]
    ]
  }
}
 */
router.post('/geom', async (req, res) => {
  const { body } = req;
  if (body.geom === undefined || body.id === undefined) {
    res.sendStatus(400);
  } else {
    await query('UPDATE buildings SET geom = St_AsText(ST_GeomFromGeoJson($1)) WHERE id = $2', [body.geom, body.id]);
    res.sendStatus(200);
  }
});

// get rooms in building by id
router.get('/:id/rooms', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT rooms.id, rooms.name, rooms.capacity, ST_AsGeoJson(St_transform(rooms.geom,4326)) geom FROM rooms INNER JOIN buildings ON rooms.building_id = buildings.id WHERE buildings.id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows);
});

// get building capacity by id
router.get('/:id/capacity', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT SUM(rooms.capacity) as capacity FROM rooms INNER JOIN buildings ON rooms.building_id = buildings.id WHERE buildings.id = $1 GROUP BY rooms.building_id', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows[0]);
});

// delete building by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM buildings WHERE id = $1', [id]);
  res.sendStatus(200);
});

// update building by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  if (body.name === undefined) {
    res.sendStatus(400);
  } else {
    const { rows } = await query('UPDATE buildings SET name = $1 WHERE id = $2 RETURNING *', [body.name, id]);
    if (rows.length === 0) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  }
});



export { router as default };
