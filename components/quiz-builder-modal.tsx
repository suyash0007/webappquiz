"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useQuiz, type Quiz, type QuizQuestion } from "@/lib/quiz-context"
import { useAuth } from "@/lib/auth-context"

export function QuizBuilderModal() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState("30")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const { createQuiz } = useQuiz()
  const { user } = useAuth()

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Math.random().toString(),
      text: "",
      options: [
        { id: Math.random().toString(), text: "" },
        { id: Math.random().toString(), text: "" },
        { id: Math.random().toString(), text: "" },
        { id: Math.random().toString(), text: "" },
      ],
      correctOptionId: "",
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)))
  }

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, text } : o)) } : q,
      ),
    )
  }

  const setCorrectAnswer = (questionId: string, optionId: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, correctOptionId: optionId } : q)))
  }

  const handleCreateQuiz = () => {
    if (!title || questions.length === 0 || !user) return

    const quiz: Quiz = {
      id: Math.random().toString(),
      title,
      description,
      timeLimit: Number.parseInt(timeLimit) * 60,
      questions,
      createdBy: user.id,
      createdAt: new Date(),
    }

    createQuiz(quiz)
    setOpen(false)
    setTitle("")
    setDescription("")
    setTimeLimit("30")
    setQuestions([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Create New Quiz</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Quiz</DialogTitle>
          <DialogDescription>Build your quiz with questions and answers</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Title</label>
            <Input
              placeholder="e.g., Biology 101 - Chapter 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Limit (minutes)</label>
            <Input type="number" min="1" max="120" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Questions ({questions.length})</h3>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                Add Question
              </Button>
            </div>

            {questions.map((question, idx) => (
              <Card key={question.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <label className="text-sm font-medium">Question {idx + 1}</label>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                      Remove
                    </Button>
                  </div>

                  <Input
                    placeholder="Enter question text"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, e.target.value)}
                  />

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Options (select correct answer)</label>
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctOptionId === option.id}
                          onChange={() => setCorrectAnswer(question.id, option.id)}
                          className="h-4 w-4"
                        />
                        <Input
                          placeholder={`Option`}
                          value={option.text}
                          onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuiz} disabled={!title || questions.length === 0}>
              Create Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
