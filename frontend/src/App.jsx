import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { LayoutProvider } from "./context/LayoutContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Papers from "./pages/Papers";
import ComparePapers from "./pages/ComparePapers";
import PaperDetails from "./pages/PaperDetails";
import Summary from "./pages/Summary";
import ResearchGap from "./pages/ResearchGap";
import Chat from "./pages/Chat";
import UploadPaper from "./pages/UploadPaper";
import SettingsPage from "./pages/Settings";
import Help from "./pages/Help";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          <Routes>
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Register */}
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>

            <Route
              path="/papers"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Papers />} />
              <Route path=":paperId" element={<PaperDetails />} />
              <Route path=":paperId/summary" element={<Summary />} />
              <Route path=":paperId/research-gap" element={<ResearchGap />} />
              <Route path=":paperId/chat" element={<Chat />} />
            </Route>

            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UploadPaper />} />
            </Route>

            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ComparePapers />} />
            </Route>

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SettingsPage />} />
            </Route>

            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Help />} />
            </Route>

            {/* Default */}
            <Route
              path="/"
              element={
                <Navigate to="/dashboard" replace />
              }
            />

            {/* Unknown URL */}
            <Route
              path="*"
              element={
                <Navigate to="/dashboard" replace />
              }
            />
          </Routes>
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
