import { buildApp } from './app.js';
import { config } from './config/config.js';

const app = buildApp();

app.listen(config.port, '0.0.0.0', () => {
  console.log(`String Analyzer API listening on http://0.0.0.0:${config.port}`);
});
