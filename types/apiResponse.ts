import { Message } from "@/model/User";

export interface ApiResponse{
    success:boolean;
    api_message:string;
    isAccepting?:boolean;
    messages?:Array<Message>;
}