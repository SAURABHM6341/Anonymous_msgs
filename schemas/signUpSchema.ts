import {z} from 'zod'

// these are the validation schema not a database schema 
// ye sab mongodb ke liye nahi hai ye mongodb ke paas jaane se phle hi saari cheeze validate kr dega 
// means they are pre validation checks for user inputs

export const userNameValidation = z.string().min(5, 'Username must be at least 5 characters long').max(20, 'Username must be at most 20 characters long').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')

export const signupSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message:'Password must be at least 6 characters long'})
})