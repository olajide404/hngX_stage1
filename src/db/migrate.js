import fs from "fs";
import path from "path";
import pkg from "pg";
import "dotenv/config";

const { Client } = pkg;
const __dirname = path.resolve();

// read from .env
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL not set in .env");
  process.exit(1);
}

// Parse the connection string to separate DB name
const match = connectionString.match(/^(postgres:\/\/[^\/]+\/)([A-Za-z0-9_-]+)$/);
if (!match) {
  console.error("❌ Invalid DATABASE_URL format.");
  process.exit(1);
}

const [_, baseUrl, dbName] = match;
const rootUrl = baseUrl + "postgres"; // connect to default postgres DB first

const sqlFile = path.join(__dirname, "migrations", "001_create_strings.sql");
const sqlContent = fs.readFileSync(sqlFile, "utf8");

async function ensureDatabaseAndMigrate() {
  const rootClient = new Client({ connectionString: rootUrl });
  try {
    await rootClient.connect();
    const res = await rootClient.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (res.rowCount === 0) {
      console.log(`📦 Database '${dbName}' not found. Creating...`);
      await rootClient.query(`CREATE DATABASE "${dbName}"`);
    } else {
      console.log(`✅ Database '${dbName}' already exists.`);
    }
  } finally {
    await rootClient.end();
  }

  // Now connect to your target DB
  const dbClient = new Client({ connectionString });
  try {
    await dbClient.connect();
    console.log("🚀 Running migrations...");
    await dbClient.query(sqlContent);
    console.log("✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await dbClient.end();
  }
}

ensureDatabaseAndMigrate();
