"use client"
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
                        Anonymous Messages
                    </Link>

                    {/* User Section */}
                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <span className="text-gray-700 font-medium hidden md:block">
                                    Welcome, <span className="text-blue-600">{user?.username || user?.email}</span>
                                </span>
                                <Link href="/dashboard">
                                    <Button variant="outline" className="mr-2">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button 
                                    className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    onClick={() => signOut()}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link href='/sign-up'>
                                    <Button variant="outline">
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link href='/sign-in'>
                                    <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;