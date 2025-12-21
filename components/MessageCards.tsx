"use client"
import { Button } from "./ui/button"
import {
    Card,
    
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import { ClientMessage } from "@/types/message"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/apiResponse"

type msgCardsprops = {
    message: ClientMessage
    onMessageDelete: (messageId: string) => void
}

const msgCards = ({ message, onMessageDelete }: msgCardsprops) => {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-msg/${message._id}`);
            if (response.data.success) {
                toast.success(response.data.message)
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Message deletion failed due to unexpected error ");

        }
        onMessageDelete(message._id);
    }


    return (
        <Card className="relative p-6 border border-gray-200 rounded-lg shadow-sm bg-white min-h-40 flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-4 flex-1">
                <div className="flex-1 overflow-hidden">
                    <p className="text-base font-semibold text-gray-900 wrap-break-word whitespace-pre-wrap leading-relaxed">
                        {message.content}
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                            variant="destructive" 
                            size="icon"
                            className="shrink-0 bg-red-500 hover:bg-red-600 rounded-md h-9 w-9"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <p className="text-sm text-gray-600 mt-auto">
                {new Date(message.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })} {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })}
            </p>
        </Card>
    );
}
export default msgCards;