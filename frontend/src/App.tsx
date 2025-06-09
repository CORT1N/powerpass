// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BackgroundProvider } from "./context/BackgroundContext";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import SharedLink from "./pages/SharedLink";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BackgroundProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/shared-links/:token" element={<SharedLink />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </BackgroundProvider>
    </AuthProvider>
  );
}

export default App;