const db = require("../database/pg.database");

exports.createUser = async (user) => {
  try {
    const res = await db.query(
      "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.name, user.email, user.password, user.balance || 0]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.updateUser = async (user) => {
  try {
    const res = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [user.name, user.email, user.password, user.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.deleteUser = async (id) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rowCount === 0) {
      return { rowCount: 0, payload: null };
    }
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return { rowCount: res.rowCount, payload: res.rows[0] };
  } catch (error) {
    console.error("Error executing DELETE query:", error);
    return { rowCount: 0, payload: null };
  }
};

// Tambahkan fungsi topUpBalance
exports.topUpBalance = async (id, amount) => {
  try {
    // Cek apakah user ada
    const userRes = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userRes.rowCount === 0) {
      return null;
    }
    // Update balance
    const updateRes = await db.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [amount, id]
    );
    return updateRes.rows[0];
  } catch (error) {
    console.error("Error topUpBalance query:", error);
    return null;
  }
};
