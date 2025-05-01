const db = require("../database/pg.database");

exports.getItemPriceRepo = async (item_id) => {
  try {
    const query = "SELECT price FROM items WHERE id = $1";
    const result = await db.query(query, [item_id]);
    if (result.rows.length === 0) {
      return null; // Item tidak ditemukan
    }
    return result.rows[0].price;
  } catch (error) {
    console.error("Error fetching item price:", error);
    return null;
  }
};

exports.createTransactionRepo = async ({ user_id, item_id, quantity, total }) => {
  try {
    const query = `
      INSERT INTO transactions (user_id, item_id, quantity, total, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *;
    `;
    const values = [user_id, item_id, quantity, total];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating transaction:", error);
    return null;
  }
};

exports.payTransactionRepo = async (transaction_id) => {
  try {
    const query = `
      UPDATE transactions
      SET status = 'paid'
      WHERE id = $1
      RETURNING *;
    `;
    const result = await db.query(query, [transaction_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error paying transaction:", error);
    return null;
  }
};

exports.deleteTransactionRepo = async (transaction_id) => {
  try {
    const query = `
      DELETE FROM transactions
      WHERE id = $1
      RETURNING *;
    `;
    const result = await db.query(query, [transaction_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return null;
  }
};

exports.getTransactionsRepo = async () => {
  try {
    const query = `
      SELECT t.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'password', u.password,
          'balance', u.balance,
          'created_at', u.created_at
        ) AS "user",
        json_build_object(
          'id', i.id,
          'name', i.name,
          'price', i.price,
          'store_id', i.store_id,
          'image_url', i.image_url,
          'stock', i.stock,
          'created_at', i.created_at
        ) AS item
      FROM transactions t
      INNER JOIN users u ON t.user_id = u.id
      INNER JOIN items i ON t.item_id = i.id
      ORDER BY t.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
};
