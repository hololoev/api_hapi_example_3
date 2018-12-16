
async function response() {
  return {
    result: 'ok',
    message: 'Hello World!'
  };
}

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: response,
    validate: {
    }
  }
};