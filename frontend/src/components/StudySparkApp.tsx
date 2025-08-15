import { useState } from "react";
import { LandingPage } from "./LandingPage";
import { Navigation } from "./Navigation";
import { Dashboard } from "./Dashboard";
import { AIChatInterface } from "./AIChatInterface";
import { NotesSection } from "./NotesSection";
import { Workshops } from "./Workshops";
import { Profile } from "./Profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, TrendingUp } from "lucide-react";

export const StudySparkApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <CoursesPage />;
      case 'ai-chat':
        return <AIChatInterface />;
      case 'notes':
        return <NotesSection />;
      case 'workshops':
        return <Workshops />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

// Simple courses page component
const CoursesPage = () => {
  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      subject: "Mathematics",
      progress: 75,
      description: "Master calculus, linear algebra, and advanced mathematical concepts",
      lessons: 24,
      completedLessons: 18
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      subject: "Physics",
      progress: 45,
      description: "Understand the fundamental principles of physics and their applications",
      lessons: 20,
      completedLessons: 9
    },
    {
      id: 3,
      title: "Chemistry Review",
      subject: "Chemistry",
      progress: 90,
      description: "Comprehensive review of organic and inorganic chemistry",
      lessons: 16,
      completedLessons: 14
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            My Courses
          </h1>
          <p className="text-muted-foreground">Track your learning progress and continue your studies</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{course.subject}</span>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <TrendingUp className="w-4 h-4" />
                  {course.progress}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.completedLessons}/{course.lessons} lessons</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};