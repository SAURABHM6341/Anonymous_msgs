"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/app/messages.json'
import Autoplay from "embla-carousel-autoplay"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  const [username,setusername] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setusername(e.target.value);
  }
  const handleSubmit = () => {
    window.location.href = `/u/${username}`;
  }
  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12 " >
        <section className="text-center mb-8 md:mb-12" >
          <h1 className="text-3xl md:text-5xl font-bold">Want to Know what really, People think about you?</h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg" >Explore Anonymous Msgs - Message Anonymously to anyone</p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-[320px] max-w-sm"
        >
          <CarouselContent>
            {messages.map((msg, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
                    <CardContent >

                      {/* Header */}
                      <CardHeader className="p-0 mb-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {msg.title}
                        </h3>
                      </CardHeader>

                      {/* Message row */}
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0l-9.75 6.75L2.25 6.75"
                            />
                          </svg>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-800  font-bold leading-snug">
                            {msg.content}
                          </p>
                          <span className="mt-1 text-xs text-gray-500">
                            {msg.received}
                          </span>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls */}
          <CarouselPrevious className="text-gray-700 border-gray-300 hover:bg-gray-100" />
          <CarouselNext className="text-gray-700 border-gray-300 hover:bg-gray-100" />
        </Carousel>
            <div className="mt-8 w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <Label htmlFor="usernameField" className="text-lg font-semibold text-gray-800">
                Type Username to Send Message
              </Label>
              <Input 
                id="usernameField"
                onChange={handleChange} 
                type="text" 
                placeholder="Enter username to send message" 
                value={username}
                className="mt-3 h-12 text-base"
              />
              <Link href={`/u/${username}`} className="block">
                <Button className="mt-4 w-full h-12 text-base font-semibold" disabled={!username}>
                  Go to Messaging Page
                </Button>
              </Link>
            </div>
      </main>

    </>
  )
}
export default Home