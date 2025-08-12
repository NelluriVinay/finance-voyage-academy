import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SiteLayout from "./layouts/SiteLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import Live from "./pages/Live";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import Community from "./pages/Community";
import Membership from "./pages/Membership";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/live" element={<Live />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/news" element={<News />} />
              <Route path="/community" element={<Community />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/login" element={<AdminAuth />} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
