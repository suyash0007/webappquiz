"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuiz } from "@/lib/quiz-context"

export function GlobalLeaderboard() {
  const { attempts } = useQuiz()

  // Group by student and get their total score
  const studentScores = new Map<string, { score: number; attempts: number }>()
  attempts.forEach((attempt) => {
    const current = studentScores.get(attempt.userName) || { score: 0, attempts: 0 }
    studentScores.set(attempt.userName, {
      score: current.score + attempt.score,
      attempts: current.attempts + 1,
    })
  })

  const leaderboard = Array.from(studentScores.entries())
    .map(([name, data]) => ({
      name,
      totalScore: data.score,
      attempts: data.attempts,
      avgScore: Math.round((data.score / data.attempts) * 10) / 10,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead className="text-right">Total Score</TableHead>
            <TableHead className="text-right">Attempts</TableHead>
            <TableHead className="text-right">Avg Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                No quiz submissions yet
              </TableCell>
            </TableRow>
          ) : (
            leaderboard.map((entry, idx) => (
              <TableRow key={entry.name}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right">{entry.totalScore}</TableCell>
                <TableCell className="text-right">{entry.attempts}</TableCell>
                <TableCell className="text-right">{entry.avgScore}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
