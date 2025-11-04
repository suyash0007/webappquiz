"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
  correctOptionId: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  timeLimit: number // in seconds
  questions: QuizQuestion[]
  createdBy: string
  createdAt: Date
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  userName: string
  answers: Record<string, string> // questionId -> selectedOptionId
  score: number
  totalQuestions: number
  completedAt: Date
}

interface QuizContextType {
  quizzes: Quiz[]
  attempts: QuizAttempt[]
  createQuiz: (quiz: Quiz) => void
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void
  deleteQuiz: (id: string) => void
  submitAttempt: (attempt: QuizAttempt) => void
  getLeaderboard: () => QuizAttempt[]
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  const createQuiz = (quiz: Quiz) => {
    setQuizzes([...quizzes, quiz])
  }

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes(quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== id))
  }

  const submitAttempt = (attempt: QuizAttempt) => {
    setAttempts([...attempts, attempt])
  }

  const getLeaderboard = () => {
    return [...attempts].sort((a, b) => b.score - a.score)
  }

  return (
    <QuizContext.Provider
      value={{ quizzes, attempts, createQuiz, updateQuiz, deleteQuiz, submitAttempt, getLeaderboard }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider")
  }
  return context
}
