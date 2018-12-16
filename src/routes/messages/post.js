
const Joi = require('joi');

async function response(request) {

  const messages = request.getModel(request.server.config.db.database, 'messages');
  let newMessage = await messages.create(request.payload);

  let count = await messages.count();

  return {
    meta: {
      total: count
    },
    data: [ newMessage ]
  };
}

module.exports = {
  method: 'POST',
  path: '/messages',
  options: {
    handler: response,
    validate: {
      payload: {
        user_id: Joi.number().integer().required(),
        message: Joi.string().min(1).max(100).required()
      }
    }
  }
};
