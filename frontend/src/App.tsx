import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TextEditor from "./pages/TextEditor";
import { useThemeStore } from "./store/useThemeStore";


const queryClient = new QueryClient();

const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster/>
    <Sonner />
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/editor" element={<TextEditor />} />
    <Route path="*" element={<NotFound />} />    </Routes>
  </BrowserRouter>
  </TooltipProvider>
  </QueryClientProvider>
);


const App = () => {
  useEffect(() => {
    // Apply saved theme only once on mount
    const saved = localStorage.getItem("theme") || "light";

    // Only update DOM if needed
    if (document.documentElement.getAttribute("data-theme") !== saved) {
      document.documentElement.setAttribute("data-theme", saved);
    }

    // Update Zustand store without causing re-render loop
    if (useThemeStore.getState().theme !== saved) {
      useThemeStore.setState({ theme: saved });
    }
  }, []);

  return <AppContent />;
};

export default App;
