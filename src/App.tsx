import { BrowserRouter, useLocation } from "react-router-dom";
import Index from "./routes/Index";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const isEditorPage = location.pathname === "/editor";

  return (
    <>
      <Navbar />

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
