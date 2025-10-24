import { buildApp } from './app.js';
import { config } from './config/config.js';   // ✅ corrected path

const app = buildApp();

// ✅ disable strict routing before starting server
app.set('strict routing', false);

app.listen(config.port, '0.0.0.0', () => {
  console.log(`String Analyzer API listening on http://0.0.0.0:${config.port}`);
});
