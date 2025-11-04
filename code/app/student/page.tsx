"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { StudentHeader } from "@/components/student-header"
import { QuizCards } from "@/components/quiz-cards"
import { QuizInterface } from "@/components/quiz-interface"
import { QuizResults } from "@/components/quiz-results"
import { GlobalLeaderboard } from "@/components/global-leaderboard"
import { useQuiz } from "@/lib/quiz-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Page = "quiz-list" | "quiz-interface" | "results"

export default function StudentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { quizzes } = useQuiz()
  const [currentPage, setCurrentPage] = useState<Page>("quiz-list")
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.role !== "student") {
      router.push("/teacher")
    }
  }, [user, router])

  if (!user || user.role !== "student") {
    return null
  }

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId)

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId)
    setCurrentPage("quiz-interface")
  }

  const handleQuizComplete = () => {
    setCurrentPage("results")
  }

  const handleBackToDashboard = () => {
    setSelectedQuizId(null)
    setCurrentPage("quiz-list")
  }

  return (
    <div className="min-h-screen bg-background">
      {currentPage === "quiz-list" && <StudentHeader />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "quiz-list" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Take a Quiz</h2>
              <QuizCards onStartQuiz={handleStartQuiz} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
                <CardDescription>Top performers across all quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <GlobalLeaderboard />
              </CardContent>
            </Card>
          </div>
        )}

        {currentPage === "quiz-interface" && selectedQuiz && (
          <div>
            <Button variant="ghost" onClick={handleBackToDashboard} className="mb-6">
              ← Back
            </Button>
            <QuizInterface quiz={selectedQuiz} onComplete={handleQuizComplete} />
          </div>
        )}

        {currentPage === "results" && selectedQuiz && (
          <QuizResults quiz={selectedQuiz} onBackToDashboard={handleBackToDashboard} />
        )}
      </main>
    </div>
  )
}
