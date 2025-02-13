
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import QueueManagement from "./pages/admin/Queue";
import QRCode from "./pages/admin/QRCode";
import Settings from "./pages/admin/Settings";
import JoinQueue from "./pages/queue/Join";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/queue" element={<AdminLayout><QueueManagement /></AdminLayout>} />
          <Route path="/admin/qr-code" element={<AdminLayout><QRCode /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
          <Route path="/queue/join/:businessId" element={<JoinQueue />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
