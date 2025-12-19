"use client"
import { Button } from "./ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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
    message:ClientMessage
    onMessageDelete: (messageId :string)=>void
}

const msgCards = ({message, onMessageDelete}:msgCardsprops) => {
    const handleDeleteConfirm = async()=>{
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-msg/${message._id}`);
            if(response.data.success){
                toast.success(response.data.message)
            }
            else{
                toast.error(response.data.message);
            }   
        } catch (error) {
            toast.error("Message deletion failed due to unexpected error ");

        }
        onMessageDelete(message._id); 
    }
    

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className="w-5 h-5" /></Button>
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
                                <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription>Card Description</CardDescription>
                    <CardAction>Card Action</CardAction>
                </CardHeader>
            </Card>

        </>
    );
}
export default msgCards;