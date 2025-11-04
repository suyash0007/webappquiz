"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { TeacherHeader } from "@/components/teacher-header"
import { QuizBuilderModal } from "@/components/quiz-builder-modal"
import { QuizList } from "@/components/quiz-list"
import { StudentLeaderboard } from "@/components/student-leaderboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeacherPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "teacher") {
      router.push("/student")
    }
  }, [user, router])

  if (!user || user.role !== "teacher") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <TeacherHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Quiz Management Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Quizzes</h2>
                <p className="text-muted-foreground">Create and manage your quizzes</p>
              </div>
              <QuizBuilderModal />
            </div>
            <QuizList />
          </div>

          {/* Student Leaderboard Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Student Leaderboard</CardTitle>
                <CardDescription>Top performing students across all quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentLeaderboard />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
