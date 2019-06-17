const path = require('path');
const jsonServer = require('json-server');
const jsonGraphqlExpress = require('json-graphql-server').default;
const db = require('./build/db.json');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'build', 'db.json'));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'build', 'assets'),
  readOnly: true,
});

const PORT = process.env.PORT || 3000;

server.use(middlewares);
server.use('/api', router);
server.use('/graphql', jsonGraphqlExpress(db));

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
