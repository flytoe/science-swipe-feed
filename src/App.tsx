
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TemporaryDetailView from "./components/TemporaryDetailView";
import { Toaster } from "./components/ui/custom-toaster";
import { getPaperById, Paper } from "./lib/supabase";
import { useDatabaseToggle } from "./hooks/use-database-toggle";

const queryClient = new QueryClient();

// PaperDetailRoute component to handle the paper/:id route with TemporaryDetailView
const PaperDetailRoute = () => {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const { databaseSource } = useDatabaseToggle();
  
  useEffect(() => {
    const loadPaper = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const decodedId = decodeURIComponent(id);
        const fetchedPaper = await getPaperById(decodedId);
        setPaper(fetchedPaper);
      } catch (error) {
        console.error('Error loading paper:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPaper();
  }, [id, databaseSource]); // Add databaseSource as dependency to reload when it changes
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>;
  }
  
  return (
    <TemporaryDetailView 
      paper={paper} 
      isOpen={true}
      onClose={() => {/* Handled by the component */}}
    />
  );
};

// AnimationLayout component to handle page transitions
const AnimationLayout = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/paper/:id" element={<PaperDetailRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <AnimationLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
