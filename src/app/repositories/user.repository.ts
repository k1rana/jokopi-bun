import { use } from "hono/jsx";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export default class UserRepository {
    public async createUser(data: {
        email: string;
        password: string;
        phoneNumber: string;
    }) {
        return (await db.insert(users).values({ ...data, }).returning().execute())[0];
    }


    public async findById(id: string) {
        return await db.query.users.findFirst({
            where: eq(users.id, id),
        });
    }

    public async findByEmail(email: string) {
        return await db.query.users.findFirst({
            where: eq(users.email, email),
            columns: {
                id: true,
                email: true,
                password: true,
                phoneNumber: true,
                roleId: true,
            },
        });
    }
}