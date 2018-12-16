console.log('DB init');

const fs = require('fs');
const Sequelize = require('sequelize');
const filepaths = require('filepaths');

const config = require('../config');

async function main() {
  if( !fs.existsSync(__dirname + '/../db') ) {
    fs.mkdirSync(__dirname + '/../db');
  }

  let sequelize = new Sequelize(config.db);

  // Загружаем все наши модельки
  for(let modelFile of filepaths.getSync(__dirname + '/../src/models')) 
    require(modelFile)(sequelize, Sequelize.DataTypes);

  // Синхронизируем модели с реальной базой данных, ели она не создана, в этот момент она создастся автоматически
  await sequelize.sync();

  // Пробегаемся по всем табличкам и проверяем сколько в них есть строк
  for(let tableName in sequelize.models) {
    let rowsCount = await sequelize.models[ tableName ].count();

    // если строк 0, то добавляем тестовые данные
    if( rowsCount == 0 ) {
      console.log('>', tableName, 'rows count:', rowsCount, 'add dymmy data to the table...');
      sequelize.models[ tableName ].bulkCreate(sequelize.models[ tableName ].dummyData);
    } else {
      // если > 0 то ничего не делаем
      console.log('>', tableName, 'rows count:', rowsCount, 'table data is already initialized');
    }
  }

  console.log('DB init DONE');
}

main();
