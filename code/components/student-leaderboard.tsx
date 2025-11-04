"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuiz } from "@/lib/quiz-context"

export function StudentLeaderboard() {
  const { attempts } = useQuiz()

  // Group by student and get their best score
  const studentScores = new Map<string, number>()
  attempts.forEach((attempt) => {
    const current = studentScores.get(attempt.userName) || 0
    studentScores.set(attempt.userName, Math.max(current, attempt.score))
  })

  const leaderboard = Array.from(studentScores.entries())
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead className="text-right">Best Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                No submissions yet
              </TableCell>
            </TableRow>
          ) : (
            leaderboard.map((entry, idx) => (
              <TableRow key={entry.name}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right">{entry.score}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
