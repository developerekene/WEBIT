import { BrowserRouter } from 'react-router-dom';
import Index from './routes/Index'; 
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Index />
      <Footer />
    </BrowserRouter>
  );
}

export default App;