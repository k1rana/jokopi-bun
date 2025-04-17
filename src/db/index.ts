import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { checkSecretOrThrowError } from "../lib/env.utils";

export const queryClientString = checkSecretOrThrowError("DB_URL");
export const queryClient = postgres(queryClientString);
export const db = drizzle(queryClient);