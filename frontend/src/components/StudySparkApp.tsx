import { useState } from "react";
import { Navigation } from "./Navigation";
import { Dashboard } from "./Dashboard";
import { AIChatInterface } from "./AIChatInterface";
import { NotesSection } from "./NotesSection";
import { Workshops } from "./Workshops";
import { Profile } from "./Profile";

const CoursesPage = () => (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <p>Your enrolled courses will be displayed here.</p>
    </div>
  );

  export const StudySparkApp = () => {
        const [activeTab, setActiveTab] = useState('dashboard');
      
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
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
              {renderContent()}
            </main>
          </div>
        );
      };