import {z} from 'zod';
import { userNameValidation } from './signUpSchema';
export const signInSchema = z.object({
    identifier: z.string(),
    password : z.string(),
})