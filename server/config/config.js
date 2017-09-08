require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
