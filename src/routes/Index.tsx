import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import TemplatesPage from '../pages/TemplatesPage';
import FeaturesPage from '../pages/FeaturesPage';

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Index;