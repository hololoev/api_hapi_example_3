#!/usr/bin/env node
'use strict';

const Hapi = require('hapi');
const filepaths = require('filepaths');
const Sequelize = require('sequelize');
const hapiBoomDecorators = require('hapi-boom-decorators');

const config = require('./config');

async function createServer() {
  // Инициализируем сервер
  const server = await new Hapi.Server(config.server);

  await server.register([
    hapiBoomDecorators,
    // Добавляем это
    {
      plugin: require('hapi-sequelizejs'),
      options: [
        {
          name: config.db.database, 
          models: [__dirname + '/src/models/*.js'], // Путь к моделькам
          //ignoredModels: [__dirname + '/server/models/**/*.js'], // Можем некоторые модельки заигнорить
          sequelize: new Sequelize(config.db), // Инициализируем обычный секьюлайз и передаём его параметром
          sync: true, // Синхронизировать/нет модели с реальной бд
          forceSync: false, // Если тру, то таблицы будут дропнуты перед синхронизацией, остарожно
        },
      ],
    }
    // Конец
  ]);

  // Загружаем все руты из папки ./src/routes/
  let routes = filepaths.getSync(__dirname + '/src/routes/');
  for(let route of routes)
    server.route( require(route) );
  
  server.ext({
    type: 'onRequest',
    method: async function (request, h) {
      request.server.config = Object.assign({}, config);
      return h.continue;
    }
  });
  
  // Запускаем сервер
  try {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch(err) { // если не смогли стартовать, выводим ошибку
    console.log(JSON.stringify(err));
  }

  // Функция должна возвращать созданый сервер, зачем оно нужно, расскажу далее
  return server;
}

createServer();