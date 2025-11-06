"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/Components/ui/button"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push(user.role === "teacher" ? "/teacher" : "/student")
    }
  }, [user, router])

  if (user) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-primary">Quiz Master</h1>
        <p className="text-lg text-muted-foreground mb-8">A comprehensive quiz platform for teachers and students</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/login")} size="lg">
            Sign In
          </Button>
          <Button onClick={() => router.push("/register")} variant="outline" size="lg">
            Register
          </Button>
        </div>
      </div>
    </main>
  )
}
