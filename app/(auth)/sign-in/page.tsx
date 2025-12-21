'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signinSchema"
import { ApiResponse } from "@/types/apiResponse"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { signIn, signOut } from "next-auth/react"
const page = () => {
  const [username, setUsername] = useState('');
  const [isformSubmitting, setisFormSubmitting] = useState(false);
  const router = useRouter();
  // zod implementation for form validation
  const form = useForm<z.infer<typeof signInSchema>>(
    {
      resolver: zodResolver(signInSchema),
      defaultValues: {
        identifier: '',
        password: '',
      }
    }
  );

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log(data);
    setisFormSubmitting(true);
    try {
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })
      console.log("SignIn Result: ", result);
      
      if (result?.error) {
        toast.error(result.error);
        setisFormSubmitting(false);
        return;
      }
      
      if (result?.ok) {
        toast.success("Signed in successfully!");
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An error occurred during sign in");
      setisFormSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md " >
        <div className="text-center" >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" >
            Login 
          </h1>
          <p className="mb-4">
            Login To Start Messaging Anonymously!
          </p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Username or Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isformSubmitting}>
              {
                isformSubmitting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</>) : ("Sign In")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4" >
          <p>
            <Link href="/sign-up" className="text-sm text-blue-600 hover:underline">
              Don't have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default page;