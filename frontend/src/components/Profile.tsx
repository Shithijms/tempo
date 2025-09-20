import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Target, 
  Clock, 
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  Brain,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    bio: "Passionate student pursuing computer science with a focus on AI and machine learning. Always eager to learn new concepts and tackle challenging problems.",
    studyGoal: "Master advanced algorithms and data structures",
    preferredSubjects: ["Computer Science", "Mathematics", "Physics"],
    studyHours: 25,
    weeklyGoal: 30
  });

  const [editData, setEditData] = useState(profileData);

  const achievements = [
    { id: 1, title: "First Goal Completed", description: "Completed your first learning goal", icon: Target, earned: true },
    { id: 2, title: "Study Streak", description: "Studied for 7 consecutive days", icon: Calendar, earned: true },
    { id: 3, title: "AI Assistant Pro", description: "Had 50+ conversations with AI tutor", icon: Brain, earned: true },
    { id: 4, title: "Knowledge Master", description: "Completed 10 courses", icon: BookOpen, earned: false },
    { id: 5, title: "Speed Learner", description: "Completed a course in under 2 weeks", icon: Zap, earned: false }
  ];

  const stats = [
    { label: "Total Study Hours", value: "142", icon: Clock, color: "text-blue-500" },
    { label: "Courses Completed", value: "8", icon: Trophy, color: "text-yellow-500" },
    { label: "Current Streak", value: "12 days", icon: TrendingUp, color: "text-green-500" },
    { label: "AI Interactions", value: "89", icon: Brain, color: "text-purple-500" }
  ];

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast("Profile Updated", {
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and track your learning journey</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : (
                    <p className="p-2 bg-muted rounded-md">{profileData.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : (
                    <p className="p-2 bg-muted rounded-md">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded-md">{profileData.bio}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studyGoal">Current Study Goal</Label>
                {isEditing ? (
                  <Input
                    id="studyGoal"
                    value={editData.studyGoal}
                    onChange={(e) => setEditData({ ...editData, studyGoal: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded-md">{profileData.studyGoal}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preferred Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferredSubjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      + Add Subject
                    </Button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Stats and Progress */}
        <div className="space-y-6">
          {/* Study Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Study Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Study Hours</span>
                  <span>{profileData.studyHours}/{profileData.weeklyGoal} hrs</span>
                </div>
                <Progress value={(profileData.studyHours / profileData.weeklyGoal) * 100} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                {profileData.weeklyGoal - profileData.studyHours} hours remaining this week
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.earned
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-muted/30 border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge variant="default" className="text-xs">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};