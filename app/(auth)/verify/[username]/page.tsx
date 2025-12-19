"use client";
import React, { use, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
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
import { Checkbox } from "@/components/ui/checkbox"

// Security form schema
const securitySchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    notDoingWrong: z.boolean().refine((val) => val === true, {
        message: "You must agree to use this service responsibly"
    }),
    shareWithFriends: z.boolean()
});

const VerifyAccount = () => {
    const router = useRouter();
    const searchParam = useSearchParams();
    const { username } = useParams<{ username: string }>();
    const email = searchParam.get('email') || '';
    const [showViewOtpModal, setShowViewOtpModal] = useState(false);
    const [otpValue, setOtpValue] = useState<string>("");
    const [otpRetrieved, setOtpRetrieved] = useState(false);
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: username,
                email: email,
                verifyCode: data.code
            })
            if (response.data.success) {
                toast.success(response.data.message || "Account verified successfully!");
                router.replace('/sign-in');
            }
            else {
                toast.error(response.data.message || "Verification failed");
            }
        } catch (error) {
            console.error("Error occured while verifying account ", error)
            const axiosError = error as AxiosError<any>;
            toast.error(axiosError.response?.data.message || "Unknown error occured while verifying account");
        }
    }

    const onSecuritySubmit = async () => {
        try {
            const payload = {
                username: username,
                email: email
            };
            const response = await axios.get('/api/view-code', { params: payload });
            
            if (response.data.success) {
                toast.success("Security verification passed!");
                setOtpValue(response.data.verifyCode);
                setOtpRetrieved(true);
            } else {
                toast.error(response.data.message || "Failed to retrieve OTP");
            }
        } catch (error) {
            console.error("Error fetching OTP: ", error);
            const axiosError = error as AxiosError<any>;
            toast.error(axiosError.response?.data.message || "Failed to retrieve OTP");
        }
    }
    const form = useForm<z.infer<typeof verifySchema>>(
        {
            resolver: zodResolver(verifySchema),
            defaultValues: {
                code: '',
            }
        }
    );

    const securityForm = useForm<z.infer<typeof securitySchema>>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            fullName: '',
            notDoingWrong: false,
            shareWithFriends: false,
        }
    });
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100" >
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md " >
                {/* Main Verification Form - Always visible unless modal is open */}
                {!showViewOtpModal ? (
                    <>
                        <div className="text-center" >
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" >
                                Verify Your Account
                            </h1>
                            <p className="mb-4">
                                Enter the verification code sent to <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Notice:</strong> Due to the unpaid version of Resend, emails cannot be delivered reliably. 
                                        Click "View OTP" to retrieve your verification code.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    name="code"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enter your Verification Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Verify Account</Button>
                            </form>
                        </Form>

                        <Button 
                            onClick={() => setShowViewOtpModal(true)}
                            variant="outline"
                            className="w-full"
                        >
                            View OTP (Security Verification Required)
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Security Verification Form */}
                        {!otpRetrieved ? (
                            <>
                                <div className="text-center">
                                    <h1 className="text-3xl font-extrabold tracking-tight mb-6">
                                        User Intent Verification
                                    </h1>
                                    <p className="mb-4 text-gray-600">
                                        Please complete the security questions to view your OTP
                                    </p>
                                </div>
                                <Form {...securityForm}>
                                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                                        <FormField
                                            name="fullName"
                                            control={securityForm.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your full name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <FormField
                                            control={securityForm.control}
                                            name="notDoingWrong"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            I am not going to do anything wrong with anyone and also this website
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={securityForm.control}
                                            name="shareWithFriends"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            I will share this webpage with my friends
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Help us grow by sharing!
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <Button 
                                            type="submit" 
                                            className="w-full"
                                            disabled={!securityForm.watch('notDoingWrong') || !securityForm.watch('shareWithFriends')}
                                        >
                                            Submit
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowViewOtpModal(false)}
                                            className="w-full"
                                        >
                                            Back to Verification
                                        </Button>
                                    </form>
                                </Form>
                            </>
                        ) : (
                            <>
                                {/* OTP Display */}
                                <div className="text-center">
                                    <h1 className="text-3xl font-extrabold tracking-tight mb-6">
                                        Your OTP Code
                                    </h1>
                                </div>
                                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Verification Code:</h3>
                                    <div className="text-3xl font-mono font-bold text-center p-4 bg-white rounded border-2 border-green-300">
                                        {otpValue}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-4 text-center">
                                        Please copy this code and use it in the verification form
                                    </p>
                                    <Button 
                                        onClick={() => {
                                            setShowViewOtpModal(false);
                                            setOtpRetrieved(false);
                                        }}
                                        className="w-full mt-4"
                                    >
                                        Go Back to Enter OTP
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyAccount;