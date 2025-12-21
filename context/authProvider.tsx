'use client'
import { SessionProvider, useSession } from "next-auth/react"

function AuthLoading({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {children: React.ReactNode}) {
  return (
    <SessionProvider>
      <AuthLoading>
        {children}
      </AuthLoading>
    </SessionProvider>
  )
}