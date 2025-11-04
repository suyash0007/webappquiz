"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuiz } from "@/lib/quiz-context"

interface QuizCardsProps {
  onStartQuiz: (quizId: string) => void
}

export function QuizCards({ onStartQuiz }: QuizCardsProps) {
  const { quizzes } = useQuiz()

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No quizzes available</p>
        <p className="text-sm text-muted-foreground">Check back later for new quizzes</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-2">{quiz.title}</CardTitle>
            <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div>Questions: {quiz.questions.length}</div>
              <div>Time Limit: {Math.floor(quiz.timeLimit / 60)} minutes</div>
            </div>
            <Button className="w-full" onClick={() => onStartQuiz(quiz.id)}>
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
