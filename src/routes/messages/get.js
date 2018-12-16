
async function response(request) {

  const messages = request.getModel(request.server.config.db.database, 'messages');

  let data = await messages.findAll();
  let count = await messages.count();

  return {
    meta: {
      total: count
    },
    data: data
  };
}

module.exports = {
  method: 'GET',
  path: '/messages',
  options: {
    handler: response
  }
};