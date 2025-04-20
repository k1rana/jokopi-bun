import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { logger as httpLogger } from 'hono/logger';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { db, queryClient } from './db';
import { Bootstrap } from './app/bootstrap';
import { env } from './lib/env.utils';

const app = new Hono()

app.use(cors());
app.use(httpLogger());
app.use(trimTrailingSlash());

const server = new Bootstrap(app);
server.configure();

export default app
