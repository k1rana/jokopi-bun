import { Hono } from "hono";
import UserRepository from "./repositories/user.repository";
import AuthService from "./services/auth.service";
import AuthController from "./controllers/auth.controller";
import { signupValidator } from "./validators/user";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { checkSecretOrThrowError } from "../lib/env.utils";

export class Bootstrap {
    private app: Hono;

    constructor(app: Hono) {
        this.app = app;
    }

    public configure() {
        // Universal catchall
        this.app.notFound((c) => {
            return c.json({ message: "Not Found" }, 404);
        });

        this.app.onError((err, c) => {
            const message = err.message || 'Internal Server Error'
            const statusCode = (err as any).code || 500

            const response: any = {
                success: false,
                message,
            }

            if (Bun.env.NODE_ENV !== "production" && err.stack) {
                response.stack = err.stack.split('\n').map(line => line.trim())
            }

            return c.json(response, statusCode)
        });

        // Repositories
        const userRepo = new UserRepository();

        // Services
        const authService = new AuthService(userRepo);


        // Controllers
        const authController = new AuthController(authService);

        // Routes
        this.registerAuthRoutes(authController);
    }

    private registerAuthRoutes(controller: AuthController) {
        const auth = new Hono()

        auth.post("/register", signupValidator, controller.signUpUser);
        this.app.route("/auth", auth);
    }

    private checkDbConnection() {
        // Check if the database connection is alive
        db.execute(sql`SELECT 1`)

        console.log("Database connection is alive");
    }
}