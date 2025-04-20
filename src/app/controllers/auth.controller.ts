import { Context } from "hono";
import AuthService from "../services/auth.service";
import { SignUpSchema } from "../validators/user";

export default class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    signUpUser = async (c: Context) => {
        const body: SignUpSchema = await c.req.parseBody();

        const user = await this.authService.registerUser(body);

        return c.json(user);
    }
}