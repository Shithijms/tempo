
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, BookOpen, Target, TrendingUp, Sparkles } from "lucide-react";
import studysparkLogo from "@/assets/studyspark-logo.png";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [isLogin, setIsLogin] = useState(false);

  const features = [
    { icon: Brain, title: "AI-Powered Learning", description: "Get personalized study plans and instant answers from our advanced AI tutor" },
    { icon: Target, title: "Goal Tracking", description: "Set learning objectives and track your progress with detailed analytics" },
    { icon: BookOpen, title: "Smart Notes", description: "AI-generated summaries and personal note-taking in one unified system" },
    { icon: TrendingUp, title: "Progress Analytics", description: "Visualize your learning journey with comprehensive progress tracking" }
  ];

 return (
    <div className="min-h-screen bg-base-100 text-base-content">

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-base-200 shadow-md">
        <div className="flex items-center gap-3">
          <img src={studysparkLogo} alt="StudySpark AI" className="w-10 h-10" />
          <h1 className="text-2xl font-bold">StudySpark AI</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-base-300 border-base-content text-base-content hover:bg-base-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </Button>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content - Hero Section */}
      <main className="container mx-auto px-6 py-16 text-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h2 className="text-5xl font-bold mb-4 leading-tight">Supercharge Your Studies with AI</h2>
            <p className="text-lg text-base-content/80 mb-8">
              StudySpark is your personal AI-powered learning assistant. Create goals, get smart suggestions, and track your progress effortlessly.
            </p>
            <div className="flex gap-4 justify-start">
                <Button size="lg" variant="default">
                    Get Started Now
                </Button>
            </div>
          </div>

          <Card className="max-w-md mx-auto w-full bg-base-200 shadow-xl">
            <CardHeader>
                <CardTitle>{isLogin ? "Welcome Back!" : "Create Your Account"}</CardTitle>
                <CardDescription>{isLogin ? "Sign in to access your dashboard." : "Join StudySpark AI to start learning smarter."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <Button className="w-full" variant="default" onClick={onLogin}>
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
              <div className="text-center text-sm text-base-content/70">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button className="text-primary hover:underline font-medium" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

        {/* Features Section */}
        <div className="py-20 bg-base-200">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-3xl font-bold mb-4">Why Choose StudySpark AI?</h3>
                <p className="text-base-content/80 mb-12 text-lg">
                    Discover the features that make learning more effective and engaging
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <Card key={feature.title} className="bg-base-300 border border-base-300 text-base-content">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                            <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-semibold text-lg">{feature.title}</h4>
                            <p className="text-base-content/80 text-sm">{feature.description}</p>
                        </CardContent>
                        </Card>
                    );
                    })}
                </div>
          </div>
        </div>
    </div>
  );
};
