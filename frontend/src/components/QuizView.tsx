// QuizView.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/store/AuthContext";

interface QuizViewProps {
  quizId: number;
  onBack?: () => void;
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
}

interface QuizData {
  id: number;
  title: string;
  questions: Question[];
}

// Corrected Result interface
interface Result {
  question_id: number;
  question_text: string;
  user_answer: string;
  is_correct: boolean;
  correct_answer: string;
  explanation?: string;
}

export const QuizView = ({ quizId, onBack }: QuizViewProps) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const qRes = await fetch(`http://127.0.0.1:8000/api/quiz/quiz/${quizId}/questions`);
        const qData = await qRes.json();
        setQuestions(qData);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleAnswer = (answer: string) => {
    if (quizData) {
      setAnswers({ ...answers, [quizData.questions[currentIndex].id]: answer });
    }
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
    if (quizData && currentIndex + 1 < quizData.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!quizData) return;

    const submission = {
      answers: Object.entries(answers).map(([question_id, answer]) => ({
        question_id: parseInt(question_id),
        answer,
      })),
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/quiz/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const resultData = await res.json();
      setResults(resultData.results);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (!quizData) return <p>Loading quiz...</p>;

  if (showResult) {
    const score = questions.filter((q) => answers[q.id] === q.correct_answer).length;

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
                {answers[q.id] === q.correct_answer ? "✅" : "❌"}
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
  
  const currentQ = quizData.questions[currentIndex];
  if (!currentQ) return <p>Loading question...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {currentIndex + 1} / {quizData.questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{currentQ.question_text}</p>

        {currentQ.question_type === "mcq" && currentQ.options && (
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

        {currentQ.type === "fill-in-the-blank" && (
          <input
            type="text"
            className="border p-2 w-full"
            value={answers[currentQ.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        )}

        {currentQ.type === "true-false" && (
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
          {currentIndex + 1 < quizData.questions.length ? "Next" : "Finish"}
        </Button>
      </CardContent>
    </Card>
  );
};
