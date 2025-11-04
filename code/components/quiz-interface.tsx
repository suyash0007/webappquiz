"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuiz, type Quiz } from "@/lib/quiz-context"
import { useAuth } from "@/lib/auth-context"

interface QuizInterfaceProps {
  quiz: Quiz
  onComplete: () => void
}

export function QuizInterface({ quiz, onComplete }: QuizInterfaceProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitAttempt } = useQuiz()
  const { user } = useAuth()

  const currentQuestion = quiz.questions[currentQuestionIdx]

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSelectOption = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId,
    })
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    // Calculate score
    let score = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctOptionId) {
        score++
      }
    })

    if (user) {
      submitAttempt({
        id: Math.random().toString(),
        quizId: quiz.id,
        userId: user.id,
        userName: user.name,
        answers,
        score,
        totalQuestions: quiz.questions.length,
        completedAt: new Date(),
      })
    }

    onComplete()
  }

  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIdx + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className={`text-2xl font-bold ${timeLeft < 60 ? "text-destructive" : "text-foreground"}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option) => (
            <Button
              key={option.id}
              variant={answers[currentQuestion.id] === option.id ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleSelectOption(option.id)}
            >
              {option.text}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
          disabled={currentQuestionIdx === 0}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIdx(Math.min(quiz.questions.length - 1, currentQuestionIdx + 1))}
          disabled={currentQuestionIdx === quiz.questions.length - 1}
        >
          Next
        </Button>

        {currentQuestionIdx === quiz.questions.length - 1 && (
          <Button className="ml-auto" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        )}
      </div>
    </div>
  )
}
