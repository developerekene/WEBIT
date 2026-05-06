import { useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import Index from "./routes/Index";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const location = useLocation();
  const isEditorPage = location.pathname.startsWith("/editor");

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10 + 2;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        progress={loadingProgress}
        onLoadingComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <>
      {!isEditorPage && <Navbar />}

      <Index />

      {!isEditorPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
