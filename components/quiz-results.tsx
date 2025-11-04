"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuiz, type Quiz } from "@/lib/quiz-context"
import { useAuth } from "@/lib/auth-context"

interface QuizResultsProps {
  quiz: Quiz
  onBackToDashboard: () => void
}

export function QuizResults({ quiz, onBackToDashboard }: QuizResultsProps) {
  const { attempts } = useQuiz()
  const { user } = useAuth()

  const userAttempts = attempts.filter((a) => a.quizId === quiz.id && a.userId === user?.id)
  const lastAttempt = userAttempts[userAttempts.length - 1]

  if (!lastAttempt) {
    return null
  }

  const percentage = Math.round((lastAttempt.score / lastAttempt.totalQuestions) * 100)
  const getResultColor = (pct: number) => {
    if (pct >= 80) return "text-green-600"
    if (pct >= 60) return "text-blue-600"
    if (pct >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Quiz Completed!</CardTitle>
          <CardDescription className="text-center">Here's how you did</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${getResultColor(percentage)}`}>{percentage}%</div>
            <p className="text-xl text-muted-foreground mt-2">
              You scored {lastAttempt.score} out of {lastAttempt.totalQuestions}
            </p>
          </div>

          <div className="space-y-2">
            {quiz.questions.map((question, idx) => {
              const isCorrect = lastAttempt.answers[question.id] === question.correctOptionId
              return (
                <Card key={question.id} className={isCorrect ? "border-green-200" : "border-red-200"}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          Question {idx + 1}: {question.text}
                        </p>
                        <p className="text-sm">
                          Your answer:{" "}
                          {question.options.find((o) => o.id === lastAttempt.answers[question.id])?.text ||
                            "Not answered"}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct answer: {question.options.find((o) => o.id === question.correctOptionId)?.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button onClick={onBackToDashboard} className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
