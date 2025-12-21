"use client"
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from '@/components/MessageCards'
const dashBoard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
    const [isStatusLoaded, setIsStatusLoaded] = useState<boolean>(false);
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => {
            message._id !== messageId
        }))
    }
    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema)
    });
    const { register, watch, setValue } = form;
    const acceptMessages = watch('isAccepting');
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message');
            setValue('isAccepting', response.data.isAccepting ?? false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to fetch Message Settings");
        }
        finally {
            setIsSwitchLoading(false);
            setIsStatusLoaded(true);
        }
    }, [setValue])

    const getMessage = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            toast.loading("Showing Latest Messages");
            const response = await axios.get<ApiResponse>('/api/get-messages');
            if (!response.data.success) {
                toast.dismiss()
                toast.error(response.data.message || "failed to fetch messages")
            } else {
                setMessages(response.data.messages || []);
                toast.dismiss()
                toast.success("Messages Fetched Successfully");
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.dismiss()
            toast.error(axiosError.response?.data.message || "Failed to fetch Messages");
        }
        finally {
            setIsSwitchLoading(false);
            setIsLoading(false);
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) {
            return;
        }
        getMessage();
        fetchAcceptMessages();
    }, [session, setValue, fetchAcceptMessages, getMessage, messages.length]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message', {
                acceptMessages: !acceptMessages
            });
            if (!response.data.success) {
                toast.error(response.data.message || "Something went Wrong While toggling the Switch")
            }
            else {
                setValue('isAccepting', !acceptMessages);
                toast.success(response.data.message || "Message acceptance Settings Changed")
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to fetch Messages");
        }
    }

    const username = session?.user?.username;
    const BaseURL = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";// please do more reasearch on ways of extracting URL
    const profileURL = `${BaseURL}/u/${username}`
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(profileURL);
        toast.success("URL Copied to Clipboard")
    }

    // Show beautiful message when not logged in
    if (!session || !session.user) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
                    <Button 
                        onClick={() => window.location.href = '/sign-in'}
                        className="w-full"
                    >
                        Log In
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        User Dashboard
                    </h1>
                    <p className="text-gray-600">Manage your messages and profile settings</p>
                </div>

                {/* Profile Link Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Your Unique Link
                    </h2>
                    <p className="text-gray-600 mb-4">Share this link to receive anonymous messages</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={profileURL}
                            disabled
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-mono text-sm"
                        />
                        <Button 
                            onClick={copyToClipBoard}
                            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                        >
                            Copy Link
                        </Button>
                    </div>
                </div>

                {/* Accept Messages Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Message Settings
                            </h2>
                            <p className="text-gray-600">
                                Control whether you want to receive new messages
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {!isStatusLoaded ? (
                                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            ) : (
                                <Switch
                                    {...register('isAccepting')}
                                    checked={acceptMessages}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isSwitchLoading}
                                />
                            )}
                            <span className={`font-semibold ${acceptMessages ? 'text-green-600' : 'text-gray-500'}`}>
                                {acceptMessages ? 'On' : 'Off'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Your Messages
                            </h2>
                            <p className="text-gray-600">
                                {messages.length} {messages.length === 1 ? 'message' : 'messages'} received
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            disabled={status !== "authenticated" || isLoading}
                            onClick={(e) => {
                                e.preventDefault();
                                if (status === "authenticated") {
                                    getMessage(true);
                                }
                            }}
                            className="flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Refreshing...
                                </>
                            ) : (
                                <>
                                    <RefreshCcw className="h-4 w-4" />
                                    Refresh
                                </>
                            )}
                        </Button>
                    </div>

                    <Separator className="mb-6" />

                    {/* Messages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <MessageCard
                                    key={message._id as string}
                                    message={message as any}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg
                                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    No Messages Yet
                                </h3>
                                <p className="text-gray-500">
                                    Share your link to start receiving anonymous messages
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default dashBoard;
