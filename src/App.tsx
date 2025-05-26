import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ProjectProvider } from './context/ProjectContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CapturePage from './pages/CapturePage';
import SettingsPage from './pages/SettingsPage';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
    <SettingsProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="capture" element={<CapturePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="project/:id" element={<ProjectPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </SettingsProvider>
  );
}

export default App;