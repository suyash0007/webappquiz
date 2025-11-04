"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuiz } from "@/lib/quiz-context"
import { useAuth } from "@/lib/auth-context"

export function QuizList() {
  const { quizzes, deleteQuiz } = useQuiz()
  const { user } = useAuth()

  const myQuizzes = quizzes.filter((q) => q.createdBy === user?.id)

  if (myQuizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No quizzes yet</p>
        <p className="text-sm text-muted-foreground">Create your first quiz to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {myQuizzes.map((quiz) => (
        <Card key={quiz.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteQuiz(quiz.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>{quiz.questions.length} questions</span>
              <span>{Math.floor(quiz.timeLimit / 60)} minutes</span>
              <span>Created {quiz.createdAt.toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
