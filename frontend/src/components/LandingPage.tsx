import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, BookOpen, Target, TrendingUp, Sparkles, Users } from "lucide-react";
import studysparkLogo from "@/assets/studyspark-logo.png";

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [isLogin, setIsLogin] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized study plans and instant answers from our advanced AI tutor"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set learning objectives and track your progress with detailed analytics"
    },
    {
      icon: BookOpen,
      title: "Smart Notes",
      description: "AI-generated summaries and personal note-taking in one unified system"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your learning journey with comprehensive progress tracking"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={studysparkLogo} alt="StudySpark AI" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-white">StudySpark AI</h1>
        </div>
        <Button 
          variant="outline" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign Up" : "Login"}
        </Button>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Your AI Study
                <span className="block bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent">
                  Companion
                </span>
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Transform your learning experience with personalized AI tutoring, smart goal tracking, 
                and intelligent progress analytics. Start your journey to academic excellence today.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Start Learning Free
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-white/70">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-white/70">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/70">AI Support</div>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="w-full max-w-md mx-auto shadow-glow">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">
                {isLogin ? "Welcome Back!" : "Join StudySpark AI"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Sign in to continue your learning journey" 
                  : "Start your personalized learning experience"
                }
              </CardDescription>
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
              <Button 
                className="w-full" 
                variant="default"
                onClick={onLogin}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  className="text-primary hover:underline font-medium"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Why Choose StudySpark AI?
          </h3>
          <p className="text-white/80 mb-12 text-lg">
            Discover the features that make learning more effective and engaging
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-white/10 border-white/20 text-white">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">{feature.title}</h4>
                    <p className="text-white/80 text-sm">{feature.description}</p>
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