
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Target, TrendingUp, Clock, Award, Brain, Lightbulb, Map } from "lucide-react";
import { CreateGoalDialog } from "./CreateGoalDialog";
import { PDFUploadCard } from "./PDFUploadCard";
import { QuizGenerationDialog } from "./QuizGenerationDialog";
import { QuizView } from "./QuizView";

export const Dashboard = () => {
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showQuizGenerationDialog, setShowQuizGenerationDialog] = useState(false);
  const [showQuizView, setShowQuizView] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const handleUploadComplete = () => {
    setShowQuizGenerationDialog(true);
  };

  const handleGenerateQuiz = () => {
    setShowQuizGenerationDialog(false);
    setShowQuizView(true);
  };

  const handleRunAnalysis = async () => {
    const userId = 1; // Assuming user ID 1 for now
    try {
      // Fetch Gap Analysis
      const gapAnalysisResponse = await fetch(`/api/gap-analysis?user_id=${userId}`);
      if (!gapAnalysisResponse.ok) {
        throw new Error(`Error fetching gap analysis: ${gapAnalysisResponse.statusText}`);
      }
      const gapAnalysisData = await gapAnalysisResponse.json();
      setGapAnalysis(gapAnalysisData);

      // Fetch Personalized Learning Path
      const recommendationsResponse = await fetch(`/api/mdp-recommendations?user_id=${userId}`);
      if (!recommendationsResponse.ok) {
        throw new Error(`Error fetching recommendations: ${recommendationsResponse.statusText}`);
      }
      const recommendationsData = await recommendationsResponse.json();
      setRecommendations(recommendationsData);

    } catch (error) {
      console.error("Failed to fetch analysis data:", error);
      // Optionally, show an error message to the user
    }
  };

  const recentCourses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      subject: "Mathematics",
      progress: 75,
      goalType: "exam prep",
      dueDate: "2024-02-15",
      totalLessons: 12,
      completedLessons: 9
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      subject: "Physics",
      progress: 45,
      goalType: "new learning",
      dueDate: "2024-03-01",
      totalLessons: 16,
      completedLessons: 7
    },
    {
      id: 3,
      title: "Chemistry Review",
      subject: "Chemistry",
      progress: 90,
      goalType: "revision",
      dueDate: "2024-01-30",
      totalLessons: 8,
      completedLessons: 7
    }
  ];

  const todayTasks = [
    { task: "Complete Calculus Chapter 5", subject: "Mathematics", urgent: true },
    { task: "Review Newton's Laws", subject: "Physics", urgent: false },
    { task: "Practice Chemical Equations", subject: "Chemistry", urgent: false },
    { task: "AI Generated Quiz - Algebra", subject: "Mathematics", urgent: true }
  ];

  if (showQuizView) {
    return <QuizView />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Ready to continue your learning journey?</p>
        </div>
        <Button variant="hero" onClick={() => setShowCreateGoal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Goal
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Active Courses</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Goals Achieved</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">87%</div>
              <div className="text-sm text-muted-foreground">Avg Progress</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">24h</div>
              <div className="text-sm text-muted-foreground">Study Streak</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleRunAnalysis} className="gap-2">
          <Brain className="w-4 h-4" />
          Analyze My Progress
        </Button>
      </div>

      {(gapAnalysis || recommendations) && (
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Gap Analysis Card */}
          {gapAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Gap Analysis
                </CardTitle>
                <CardDescription>
                  Identifying your knowledge gaps and misconceptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-bold">Overall Accuracy: {gapAnalysis.overall_accuracy}%</p>
                <div className="mt-4">
                  <h4 className="font-semibold">Weak Topics:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    {gapAnalysis.weak_topics.map(topic => (
                      <li key={topic.topic}>
                        <strong>{topic.topic}:</strong> {topic.accuracy_rate}% accuracy.
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold">Detected Misconceptions:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    {gapAnalysis.misconceptions.map(mc => (
                      <li key={mc.topic}>
                        <strong>{mc.topic}:</strong> {mc.pattern} {mc.recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personalized Learning Path Card */}
          {recommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary" />
                  Your Personalized Learning Path
                </CardTitle>
                <CardDescription>
                  Next steps to improve your score, powered by AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-bold">Expected Improvement: +{recommendations.expected_improvement_percent}%</p>
                <div className="mt-4 space-y-2">
                  {recommendations.policy.map((step, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-semibold">{index + 1}. {step.category_name} ({step.difficulty})</p>
                      <p className="text-sm text-muted-foreground">{step.rationale}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}


      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Your Active Courses
              </CardTitle>
              <CardDescription>
                Continue where you left off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.subject}</p>
                    </div>
                    <Badge variant="secondary">
                      {course.goalType}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <span>Due: {course.dueDate}</span>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Continue Learning
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Today's Tasks and PDF Upload */}
        <div>
          <PDFUploadCard onUploadComplete={handleUploadComplete} />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Today's Tasks
              </CardTitle>
              <CardDescription>
                Stay on track with your goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {task.subject}
                      </Badge>
                      {task.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateGoalDialog 
        open={showCreateGoal} 
        onOpenChange={setShowCreateGoal}
      />

      <QuizGenerationDialog
        open={showQuizGenerationDialog}
        onOpenChange={setShowQuizGenerationDialog}
        onGenerateQuiz={handleGenerateQuiz}
      />
    </div>
  );
};
