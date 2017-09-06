import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
// import configs from '../config/config';

const basename = path.basename(module.filename);
// const env = process.env.NODE_ENV || 'development';
// const config = configs[env];

const db = {};
let sequelize;

if (process.env.DATABASE_URL_TEST) {
  sequelize = new Sequelize(process.env.DATABASE_URL_TEST);
} else {
  const config = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  };
  sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME,
    process.env.DB_PASSWORD, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    const fileName = (file.indexOf('.') !== 0) &&
                      (file !== basename) &&
                      (file.slice(-3) === '.js');
    return fileName;
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
