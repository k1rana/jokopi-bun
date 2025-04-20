
import { defineConfig } from 'drizzle-kit';
import { checkSecretOrThrowError } from './src/lib/env.utils';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/schema/migration',
  dialect: 'postgresql',
  dbCredentials: {
    url: checkSecretOrThrowError("DB_URL"),
  },
  verbose: true,
  strict: true,
});