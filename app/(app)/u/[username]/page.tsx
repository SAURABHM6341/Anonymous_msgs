'use client'
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "sonner";
import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import messages from "@/app/messages.json";
import { useCompletion } from '@ai-sdk/react'
import * as z from "zod";
import { MessageSchemaValidation } from "@/schemas/messageSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react";
const page = () => {
    const [message, setMessage] = useState('');
    const { username } = useParams();
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([messages[0].content, messages[1].content, messages[2].content]);
    const [isformSubmitting, setIsformSubmitting] = useState(false);
    const handleSendMessage = async () => {
        setIsformSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                username: username,
                content: message
            });
            if (!response.data.success) {
                toast.error(response.data.message || "Message cannot be Sent");
            }
            else {
                toast.success(response.data.message || "Message Sent Successfully");
            }
            setMessage('');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to send message");
        }
        finally {
            setIsformSubmitting(false)
        }
    }
    const handleMessageClick = (sugmsg: string) => {
        setMessage(sugmsg);
    }
    const { complete, completion, isLoading } = useCompletion({
        api: '/api/suggest-messages',
    });

    const handlesuggestion = async () => {
        try {
            await complete('');
            if (completion) {
                setSuggestedMessages(completion.split('||'));
            }
        } catch (error) {
            toast.error('Failed to fetch suggestions');
        }
    };

    useEffect(() => {
        if (completion) {
            setSuggestedMessages(completion.split('||'));
        }
    }, [completion]);
    // form validation
    const form = useForm<z.infer<typeof MessageSchemaValidation>>(
        {
            resolver: zodResolver(MessageSchemaValidation),
            defaultValues: {
                content: '',
            }
        }
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Send Message Anonymously</h1>
                    <p className="text-lg text-gray-600">
                        Send Anonymous Message to <span className="font-semibold text-blue-600">@{username}</span>
                    </p>
                </div>

                {/* Message Form Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSendMessage)} className="space-y-6">
                            <FormField
                                name="content"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-gray-800">Your Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter your message here..."
                                                {...field}
                                                onChange={(e) => {
                                                    setMessage(e.target.value)
                                                }}
                                                value={message}
                                                className="min-h-[150px] text-base"
                                            />
                                        </FormControl>
                                        <p className={`text-sm ${message.length > 2 && message.length <= 300 ? 'text-green-500' : 'text-red-500'}`}>
                                            {message.length > 300 ? "Message is too long" : (message.length <= 2 && message.length > 0) ? "Message is too short" : ""}
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isformSubmitting || message.length < 3 || message.length > 300}
                                type="submit"
                                className="w-full h-12 text-base font-semibold"
                            >
                                {isformSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please Wait
                                    </>
                                ) : (
                                    "Send Message"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                <Separator className="my-6" />

                {/* Suggested Messages Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Suggested Messages</h2>
                        <Button
                            onClick={handlesuggestion}
                            disabled={isLoading}
                            variant="outline"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Get Suggestions"
                            )}
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Click on any message below to select it.</p>
                    <div className="space-y-3">
                        {suggestedMessages.map((sugmsg, index) => (
                            <Item
                                variant="outline"
                                size="sm"
                                className="cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => handleMessageClick(sugmsg)}
                                key={index}
                            >
                                <ItemContent>
                                    <ItemTitle className="text-gray-800">{sugmsg}</ItemTitle>
                                </ItemContent>
                            </Item>
                        ))}
                    </div>
                </div>

                <Separator className="my-6" />

                {/* CTA Section */}
                <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 md:p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">Get Your Shareable Link</h2>
                    <p className="mb-4 text-blue-100">Create your account and start receiving anonymous messages</p>
                    <Link href={'/sign-up'}>
                        <Button
                            variant="secondary"
                            className="h-12 px-8 text-base font-semibold"
                        >
                            Create Your Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default page;