const config = {
  username: process.env.DB_USER || "sa",
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT || "mssql",
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
