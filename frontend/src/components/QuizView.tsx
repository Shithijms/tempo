// QuizView.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuizViewProps {
  quizId: number; // ✅ quizId, not documentId
  onBack?: () => void;
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
}

export const QuizView = ({ quizId, onBack }: QuizViewProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qRes = await fetch(`http://127.0.0.1:8000/api/quiz/quiz/${quizId}/questions`);
        const qData = await qRes.json();
        setQuestions(qData);
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
          {onBack && <Button onClick={onBack}>⬅ Back</Button>}
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
              variant={answers[currentQ.id] === "True" ? "default" : "outline"}
              onClick={() => handleAnswer("True")}
              className="w-full"
            >
              True
            </Button>
            <Button
              variant={answers[currentQ.id] === "False" ? "default" : "outline"}
              onClick={() => handleAnswer("False")}
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
