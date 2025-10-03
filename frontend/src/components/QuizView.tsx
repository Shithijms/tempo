// QuizView.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/store/AuthContext";

interface QuizViewProps {
  quizId: number; // ✅ quizId, not documentId
  onBack?: () => void;
}

interface Question {
  id: number;
  question: string;
  type: string; // "mcq" | "fill_blank" | "true_false"
  options?: string[];
  correct_answer: string;
  explanation: string;
}

export const QuizView = ({ quizId, onBack }: QuizViewProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const quizStartTime = useMemo(() => Date.now(), [quizId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch full quiz to include correct answers and explanations
        const res = await fetch(`http://127.0.0.1:8000/api/quiz/quiz/${quizId}`);
        const data = await res.json();
        const normalized = Array.isArray(data?.questions)
          ? data.questions.map((q: any) => ({
              id: q.id,
              question: q.question_text ?? q.question ?? "",
              type: q.question_type ?? q.type ?? "mcq",
              options: q.options ?? [],
              correct_answer: q.correct_answer ?? "",
              explanation: q.explanation ?? "",
            }))
          : [];
        setQuestions(normalized);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: answer });
  };

  const normalize = (value: string | undefined | null) => {
    if (value == null) return "";
    return String(value).trim().toLowerCase();
  };

  const isAnswerCorrect = (q: Question, userAnswer: string | undefined) => {
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(q.correct_answer);

    // Handle true/false synonyms
    if (q.type === "true_false") {
      const tfMap: Record<string, string> = {
        true: "true",
        t: "true",
        yes: "true",
        false: "false",
        f: "false",
        no: "false",
      };
      const nu = tfMap[normalizedUser] ?? normalizedUser;
      const nc = tfMap[normalizedCorrect] ?? normalizedCorrect;
      return nu === nc;
    }

    // For MCQ: compare user selection to the correct answer only
    if (q.type === "mcq" && Array.isArray(q.options)) {
      const stripLabel = (text: string) => text.replace(/^([A-Z])\)\s*/i, "");
      const normalizedUserText = normalize(stripLabel(userAnswer ?? ""));
      const normalizedCorrectText = normalize(stripLabel(q.correct_answer ?? ""));

      if (normalizedUserText && normalizedCorrectText && normalizedUserText === normalizedCorrectText) {
        return true;
      }

      // Also support letter-only answers like "A", "B"
      const letters = ["a", "b", "c", "d", "e", "f", "g"];
      const userIndex = letters.indexOf(normalize(userAnswer ?? ""));
      const correctIndex = letters.indexOf(normalize(q.correct_answer ?? ""));
      return userIndex !== -1 && userIndex === correctIndex;
    }

    // Fill in the blank: simple normalized comparison
    return normalizedUser === normalizedCorrect;
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  // ✅ Safeguard
  if (questions.length === 0) return <p>Loading quiz...</p>;
  const currentQ = questions[currentIndex];
  if (!currentQ) return <p>Loading question...</p>;

  if (showResult) {
    const score = questions.filter((q) => isAnswerCorrect(q, answers[q.id])).length;

    const handleSubmitResults = async () => {
      if (submitted || submitting) return;
      try {
        setSubmitting(true);
        const timeSpentMins = Math.max(1, Math.round((Date.now() - quizStartTime) / 60000));
        const payload = {
          user_id: (user as any)?.id ?? 1,
          answers: questions.map((q) => ({
            question_id: q.id,
            user_answer: answers[q.id] ?? "",
          })),
          time_spent_minutes: timeSpentMins,
        };
        const base = (import.meta as any).env?.VITE_LEARNTRACK_API || "http://127.0.0.1:8000";
        const res = await fetch(`${base}/quizzes/${quizId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // Best-effort; ignore failures for UX continuity
        await res.json().catch(() => undefined);
        setSubmitted(true);
      } catch (e) {
        console.error("Failed to submit quiz results", e);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold mb-4">Score: {score} / {questions.length}</p>
          {questions.map((q) => (
            <div key={q.id} className="mb-4 p-3 border rounded">
              <p className="font-semibold">{q.question}</p>
              <p>
                Your Answer: {answers[q.id] || "Not answered"}{" "}
                {isAnswerCorrect(q, answers[q.id]) ? "✅" : "❌"}
              </p>
              <p>Correct Answer: {q.correct_answer}</p>
              <p className="text-sm text-muted-foreground">
                Explanation: {q.explanation}
              </p>
            </div>
          ))}
          <div className="flex gap-2">
            <Button disabled={submitted || submitting} onClick={handleSubmitResults}>
              {submitted ? "Saved" : submitting ? "Saving..." : "Save Results"}
            </Button>
            {onBack && <Button variant="outline" onClick={onBack}>⬅ Back</Button>}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {currentIndex + 1} / {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{currentQ.question}</p>

        {/* Render based on type */}
        {currentQ.type === "mcq" && currentQ.options && (
          <div className="space-y-2">
            {currentQ.options.map((opt, i) => (
              <Button
                key={i}
                variant={answers[currentQ.id] === opt ? "default" : "outline"}
                onClick={() => handleAnswer(opt)}
                className="w-full"
              >
                {opt}
              </Button>
            ))}
          </div>
        )}

        {currentQ.type === "fill_blank" && (
          <input
            type="text"
            className="border p-2 w-full"
            value={answers[currentQ.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        )}

        {currentQ.type === "true_false" && (
          <div className="space-y-2">
            <Button
              variant={normalize(answers[currentQ.id]) === "true" ? "default" : "outline"}
              onClick={() => handleAnswer("true")}
              className="w-full"
            >
              True
            </Button>
            <Button
              variant={normalize(answers[currentQ.id]) === "false" ? "default" : "outline"}
              onClick={() => handleAnswer("false")}
              className="w-full"
            >
              False
            </Button>
          </div>
        )}

        <Button className="mt-4 w-full" onClick={nextQuestion}>
          {currentIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardContent>
    </Card>
  );
};
