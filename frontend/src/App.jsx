import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";

import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Nav from "./components/nav/Nav";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Content = lazy(() => import("./pages/Content"));
const Image = lazy(() => import("./pages/Image"));
const GenerateContent = lazy(() => import("./pages/GenerateContent"));
const GenerateImage = lazy(() => import("./pages/GenerateImage"));
const ContentHistory = lazy(() => import("./pages/ContentHistory"));
const ResumeRater = lazy(() => import("./pages/ResumeRater"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Pages where Nav should be hidden (they have their own nav)
const HIDE_NAV_ROUTES = ["/", "/login", "/register"];

function App() {
  const { pathname } = useLocation();
  const showNav = !HIDE_NAV_ROUTES.includes(pathname);

  return (
    <ErrorBoundary>
      <ToastContainer transition={Flip} />
      {showNav && <Nav />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/image" element={<Image />} />
          <Route path="/content" element={<Content />} />

          {/* Protected — /content/history MUST come before /content/:action */}
          <Route
            path="/content/history"
            element={
              <ProtectedRoute>
                <ContentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/:action"
            element={
              <ProtectedRoute>
                <GenerateContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/image/generate"
            element={
              <ProtectedRoute>
                <GenerateImage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/:action"
            element={
              <ProtectedRoute>
                <ResumeRater />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
