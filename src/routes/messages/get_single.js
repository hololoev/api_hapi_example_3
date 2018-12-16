
const Joi = require('joi');
const Boom = require('boom');

async function response(request) {

  const messages = request.getModel(request.server.config.db.database, 'messages');
  let data = await messages.findOne({ where: { id: request.params.id } });

  if( !data ) {
    throw Boom.notFound();
  }

  let count = await messages.count();

  return {
    meta: {
      total: count
    },
    data: [ data ]
  };
}

module.exports = {
  method: 'GET',
  path: '/messages/{id}',
  options: {
    handler: response,
    validate: {
      params: {
        id: Joi.number().integer().required()
      }
    }
  }
};