const pg = require("pg");

const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgress://localhost/the_acme_store_db"
);

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
     id UUID PRIMARY KEY,
     username VARCHAR(50) NOT NULL UNIQUE,
     password VARCHAR(50) NOT NULL
    );
    CREATE TABLE products(
     id UUID PRIMARY KEY,
     name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE favorites(
     id UUID PRIMARY KEY,
     product_id (UUID REFERENCES products table NOT NULL),
     user_id (UUID REFERENCES users table NOT NULL)
    );
    `;
};

const createProduct = async () => {};

const createUser = async ({ name, password }) => {
  const SQL = `INSERT INTO users(id, name, password) VALUES($1, $2, $3)
                 RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name, password]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `SELECT * FROM users`;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `SELECT * FROM products`;
  const response = await client.query(SQL);
  return response.rows;
};

const createFavorite = async ({ product_id, user_id }) => {
  const SQL = `
      INSERT INTO favorites(
      id, product_id, user_id
      ) VALUES($1, $2, $3) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), product_id, user_id]);
  return response.rows[0];
};

const fetchFavorites = async () => {
  const SQL = `SELECT * FROM favorites`;
  const response = await client.query(SQL);
  return response.rows;
};

const destroyFavorite = async ({ id, user_id }) => {
  const SQL = `DELETE FROM favorites
    WHERE id = $1 AND user_id = $2`;
  await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
