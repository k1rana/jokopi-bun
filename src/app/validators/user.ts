import { validator } from 'hono/validator';
import { z } from "zod"
import { validateSchema } from './base';

export const signUpSchema = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255),
    phoneNumber: z.string(),
})


export const signupValidator = validator('json', (value, c) => {
    return validateSchema(c, signUpSchema, value);
});

export type SignUpSchema = z.infer<typeof signUpSchema>