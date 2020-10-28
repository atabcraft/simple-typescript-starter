import { createServer } from 'http';
import { start } from 'repl';
import { app } from './app';
import { AuthService } from './auth/auth.service';
import { sequelize } from './sequelize';

const port = process.env.PORT || 5000;
const authService = new AuthService();

async function startServer() {
  await sequelize.sync({ force: true });
  authService.setupPassport();
  createServer(app).listen(port, () => {
    console.log(`Server listen on port ${port}`);
  });
}

startServer();
