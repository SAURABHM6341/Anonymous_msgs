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
            setValue('isAccepting', response.data.isAccepting ?? true)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to fetch Message Settings");
        }
        finally {
            setIsSwitchLoading(false);
        }
    }, [setValue])

    const getMessage = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            if (!response.data.success) {
                toast.error(response.data.message || "failed to fetch messages")
            } else {
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast.loading("Showing Latest Messages");
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
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
    }, [session, setValue, fetchAcceptMessages, getMessage]);

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

    if (!session || !session.user) {
        return <div>Please LogIn</div>
    }

    return (
        <>
            <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl" >
                <h1 className="text-4xl font-bold mb-4" >
                    User Dashboard
                </h1>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2" >
                        Copy Your Unique Link
                    </h2>{' '}
                    <div className="flex items-center">
                        <input type="text"
                            value={profileURL}
                            disabled
                            className="input input-bordered w-full p-2 mr-2" />
                        <Button onClick={copyToClipBoard} >Copy </Button>
                    </div>
                </div>
                <div className="mb-4">
                    <Switch
                        {...register('isAccepting')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                    />
                    <span className="ml-2" >
                        Accept Messages: {acceptMessages ? 'On' : 'Off'}
                    </span>
                </div>
                <Separator />
                <Button
                    className="mt-4"
                    variant="outline"
                    disabled={status !== "authenticated" || isLoading}
                    onClick={(e) => {
                        e.preventDefault();
                        if (status === "authenticated") {
                            getMessage(true);
                        }
                    }}
                >
                    {
                        isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )
                    }
                </Button>
                <div className="mt-4 grid-cols-1 md:grid-cols-2 gap-6" >
                    {
                        messages.length > 0 ? (
                            messages.map((message, index) => (
                                <MessageCard
                                    key={message._id as string}
                                    message={message as any}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            ))
                        ) : (
                            <>
                                <p>No Messages to Display </p></>
                        )
                    }
                </div>
            </div>
        </>
    );
}
export default dashBoard;
