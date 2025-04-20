import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { checkSecretOrThrowError } from "../lib/env.utils";
import * as schema from "./schema";

export const queryClientString = checkSecretOrThrowError("DB_URL");
export const queryClient = postgres(queryClientString);
export const db = drizzle({
    client: queryClient,
    schema
});