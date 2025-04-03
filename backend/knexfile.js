import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT, 10),
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "chatbot_knex_migrations",
      directory: join(__dirname, "src/migrations"),
      extension: "js",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT, 10),
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "chatbot_knex_migrations",
      directory: join(__dirname, "src/migrations"),
      extension: "js",
    },
  },
};

export default config;
