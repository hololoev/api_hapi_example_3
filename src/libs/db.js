console.log('DB init');

const fs = require('fs');
const Sequelize = require('sequelize');
const filepaths = require('filepaths');

const config = require('../../config');

function main() {
  if( !fs.existsSync(__dirname + '/../../db') ) {
    fs.mkdirSync(__dirname + '/../../db');
  }

  let sequelize = new Sequelize(config.db);

  // Загружаем все наши модельки
  for(let modelFile of filepaths.getSync(__dirname + '/../models')) 
    require(modelFile)(sequelize, Sequelize.DataTypes);

  sequelize.testUID = Math.random();

  return sequelize;
}

module.exports = main();
