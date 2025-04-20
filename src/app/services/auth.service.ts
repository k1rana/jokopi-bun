import { BaseException } from "../exceptions/base.exception";
import UserRepository from "../repositories/user.repository";
import { SignUpSchema } from "../validators/user";

export default class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }

    async registerUser(data: SignUpSchema, roleId?: number) {
        const { email, password, phoneNumber } = data;
        const user = await this.userRepository.findByEmail(email);
        if (user) {
            throw new BaseException("User with that email already exists", {
                status: 409,
                code: "USER_ALREADY_EXISTS",
            })
        }

        const hashedPassword = await Bun.password.hash(password);
        const newUser = await this.userRepository.createUser({
            email,
            password: hashedPassword,
            phoneNumber,
        });
        return newUser;

    }

    async matchCredential(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return null;
        }

        const isMatch = await Bun.password.verify(password, user.password);
        if (!isMatch) {
            throw new BaseException("Invalid credentials", {
                status: 401,
            });
        }
        return user;
    }
}