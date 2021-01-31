import { createServer } from 'http';
import { start } from 'repl';
import { app } from './app';
import { sequelize } from './sequelize';

const port = process.env.PORT || 5000;

async function startServer() {
  await sequelize.sync({ force: true });
  createServer(app).listen(port, () => {
    console.log(`Server listen on port ${port}`);
  });
}

startServer();
