'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
const page = () => {
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isformSubmitting, setisFormSubmitting] = useState(false);
  // we will use usehook.ts ibrary for easily implementing hooks
  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter();
  // zod implementation for form validation
  const form = useForm<z.infer<typeof signupSchema>>(
    {
      resolver: zodResolver(signupSchema),
      defaultValues: {
        username: '',
        email: '',
        password: '',
      }
    }
  );
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setisCheckingUsername(true);
        setUsernameMsg("");
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMsg(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          setUsernameMsg(axiosError.response?.data.message ?? "Error in checking username")
        }
        finally {
          setisCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log(data);
    setisFormSubmitting(true);
    try {
      const response = await axios.post<any>('/api/sign-up', data);
      if (response.data.success) {
        toast.success(response.data.message || "Sign up successful!");
        router.replace(`/verify?email=${data.email}&username=${data.username}`);
      }
      else {
        toast.error(response.data.message || "Sign up failed");
      }
    } catch (error) {
      console.error("Error occured during sign-up ", error)
      const axiosError = error as AxiosError<any>;
      toast.error(axiosError.response?.data.message || "Unknown error occured during sign-up");
    } finally {
      setisFormSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md " >
        <div className="text-center" >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" >
            Join Anonymous Messaging
          </h1>
          <p className="mb-4">
            Sign-up To Start Sending Messages Anonymously
          </p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMsg==="Username is available"?'text-green-500':'text-red-500'}`} >
                    {usernameMsg}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                isformSubmitting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</>) : ("Sign Up")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4" >
          <p>
            <Link href="/sign-in" className="text-sm text-blue-600 hover:underline">
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default page;