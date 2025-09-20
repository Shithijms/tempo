
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quizQuestions = [
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
    answer: "Mitochondria",
  },
  {
    question: "What is the formula for water?",
    options: ["H2O", "CO2", "O2", "H2"],
    answer: "H2O",
  },
];

export const QuizView = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {showResult ? (
          <div>
            <h2 className="text-xl font-bold">Quiz Result</h2>
            <p>You scored {score} out of {quizQuestions.length}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold">{quizQuestions[currentQuestion].question}</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {quizQuestions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  onClick={() => handleAnswerSelection(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button onClick={handleNextQuestion} className="mt-6">
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
