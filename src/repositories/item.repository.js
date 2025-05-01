const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING
});

exports.createItem = async ({ name, price, store_id, image_url, stock }) => {
  const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [store_id]);
  if (storeCheck.rowCount === 0) throw new Error("Store doesnt exist");
  const result = await pool.query(
    `INSERT INTO items (name, price, store_id, image_url, stock)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, price, store_id, image_url, stock]
  );
  return result.rows[0];
};

exports.getItems = async () => {
  const result = await pool.query('SELECT * FROM items');
  return result.rows;
};

exports.getItemById = async (id) => {
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  return result.rows[0];
};

exports.getItemsByStoreId = async (store_id) => {
  const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [store_id]);
  if (storeCheck.rowCount === 0) return null;
  const result = await pool.query('SELECT * FROM items WHERE store_id = $1', [store_id]);
  return result.rows;
};

exports.updateItem = async ({ id, name, price, store_id, image_url, stock }) => {
  const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [store_id]);
  if (storeCheck.rowCount === 0) return null;
  const result = await pool.query(
    `UPDATE items
     SET name = $1,
         price = $2,
         store_id = $3,
         image_url = COALESCE($4, image_url),
         stock = $5
     WHERE id = $6 RETURNING *`,
    [name, price, store_id, image_url, stock, id]
  );
  return result.rows[0];
};

exports.deleteItem = async (id) => {
  const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
