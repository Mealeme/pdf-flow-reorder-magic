
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhotoToImage from "./pages/PhotoToImage";
import PdfCompress from "./pages/PdfCompress";
import PdfToWorld from "./pages/PdfToWorld";
import FooterInfo from "./pages/FooterInfo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import TermsAndConditions from "./pages/TermsAndConditions";
import CancellationRefund from "./pages/CancellationRefund";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import "./aws-config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/photo-to-image" element={<PhotoToImage />} />
            <Route path="/pdf-compress" element={<PdfCompress />} />
            <Route path="/pdf-to-world" element={<PdfToWorld />} />
            <Route path="/footer-info" element={<FooterInfo />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
