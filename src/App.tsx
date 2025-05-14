
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LostFoundPage from "./pages/LostFoundPage";
import PostItemPage from "./pages/PostItemPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AdminPanel from "./pages/AdminPanel";
import FeedbackPage from "./pages/FeedbackPage";
import NotFoundPage from "./pages/NotFoundPage";

// Auth-guarded routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

// Wrap DataProvider around components that need access to the data context
const AppWithProviders = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected Routes - Wrapped with DataProvider */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DataProvider>
              <DashboardPage />
            </DataProvider>
          </ProtectedRoute>
        } />
        <Route path="/lost-found" element={
          <ProtectedRoute>
            <DataProvider>
              <LostFoundPage />
            </DataProvider>
          </ProtectedRoute>
        } />
        <Route path="/post-item" element={
          <ProtectedRoute>
            <DataProvider>
              <PostItemPage />
            </DataProvider>
          </ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute>
            <DataProvider>
              <AboutPage />
            </DataProvider>
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <DataProvider>
              <ContactPage />
            </DataProvider>
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <DataProvider>
              <FeedbackPage />
            </DataProvider>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes - Wrapped with DataProvider */}
        <Route path="/admin" element={
          <AdminRoute>
            <DataProvider>
              <AdminPanel />
            </DataProvider>
          </AdminRoute>
        } />
        <Route path="/admin/categories" element={
          <AdminRoute>
            <DataProvider>
              <AdminPanel />
            </DataProvider>
          </AdminRoute>
        } />
        <Route path="/admin/messages" element={
          <AdminRoute>
            <DataProvider>
              <AdminPanel />
            </DataProvider>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <DataProvider>
              <AdminPanel />
            </DataProvider>
          </AdminRoute>
        } />
        <Route path="/admin/contact-info" element={
          <AdminRoute>
            <DataProvider>
              <AdminPanel />
            </DataProvider>
          </AdminRoute>
        } />
        <Route path="/admin/system-info" element={
          <AdminRoute>
            <DataProvider>
              <AdminPanel />
            </DataProvider>
          </AdminRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppWithProviders />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
