import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingParticlesBackground from "@/components/ParticlesBackground";
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Shield,
  CheckCircle,
  Key,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThreeDCube from "@/components/ThreeDCube";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmationCode, setShowConfirmationCode] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { login, register, confirmRegistration, resendConfirmationCode, initiatePasswordReset, confirmPasswordReset, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const intendedPath = sessionStorage.getItem('intendedPath') || '/';
      sessionStorage.removeItem('intendedPath');
      navigate(intendedPath);
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect to intended destination or home
      const intendedPath = sessionStorage.getItem('intendedPath') || '/';
      sessionStorage.removeItem('intendedPath');
      navigate(intendedPath);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await register(email, password);
      setShowConfirmationCode(true);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmRegistration(email, confirmationCode);
      setActiveTab("login");
      setShowConfirmationCode(false);
      setConfirmationCode("");
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleResendCode = async () => {
    try {
      await resendConfirmationCode(email);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    
    try {
      await initiatePasswordReset(email);
      setShowResetPassword(true);
      setShowForgotPassword(false);
    } catch (error) {
      alert("Failed to send reset code. Please try again.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetCode) {
      alert("Please enter the reset code");
      return;
    }
    
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }
    
    if (!confirmPassword) {
      alert("Please confirm your new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      await confirmPasswordReset(email, resetCode, newPassword);
      setShowForgotPassword(false);
      setShowResetPassword(false);
      setActiveTab("login");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("Failed to reset password. Please check your reset code and try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <FloatingParticlesBackground />
      <ThreeDCube />
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative" style={{ zIndex: 10 }}>
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center text-gray-400 hover:text-blue-400 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="shadow-2xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 ease-out glow-border">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Welcome to NewMicro</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              {!showConfirmationCode && !showForgotPassword && !showResetPassword ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger 
                      value="login" 
                      className="flex items-center space-x-2 hover:scale-105 transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register" 
                      className="flex items-center space-x-2 hover:scale-105 transition-all duration-300"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-sm font-medium text-gray-300">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-sm font-medium text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-600 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                                             <Button
                         type="submit"
                         disabled={isLoading}
                         className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                       >
                         {isLoading ? (
                           <div className="flex items-center">
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                             Signing In...
                           </div>
                         ) : (
                           <div className="flex items-center">
                             <LogIn className="mr-2 h-4 w-4" />
                             Sign In
                           </div>
                         )}
                       </Button>

                       <div className="text-center mt-4">
                         <button
                           type="button"
                           onClick={() => setShowForgotPassword(true)}
                           className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300"
                         >
                           Forgot your password?
                         </button>
                       </div>
                     </form>
                   </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-sm font-medium text-gray-300">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-sm font-medium text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-600 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-600 text-gray-400"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Account...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Account
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                                 </Tabs>
               ) : showForgotPassword && !showResetPassword ? (
                 <div className="space-y-4">
                   <div className="text-center mb-6">
                     <div className="w-16 h-16 bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Key className="w-8 h-8 text-orange-400" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-200 mb-2">Reset Your Password</h3>
                     <p className="text-gray-400">
                       Enter your email address and we'll send you a reset code
                     </p>
                   </div>

                   <form onSubmit={handleForgotPassword} className="space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-300">
                         Email Address
                       </Label>
                       <div className="relative">
                         <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                         <Input
                           id="forgot-email"
                           type="email"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="pl-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                           required
                         />
                       </div>
                     </div>

                     <Button
                       type="submit"
                       disabled={isLoading}
                       className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                     >
                       {isLoading ? (
                         <div className="flex items-center">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           Sending Reset Code...
                         </div>
                       ) : (
                         <div className="flex items-center">
                           <Key className="mr-2 h-4 w-4" />
                           Send Reset Code
                         </div>
                       )}
                     </Button>

                     <div className="text-center">
                       <button
                         type="button"
                         onClick={() => {
                           setShowForgotPassword(false);
                           setEmail("");
                         }}
                         className="text-sm text-gray-400 hover:text-gray-300 hover:underline transition-colors duration-300"
                       >
                         <ArrowLeft className="inline mr-1 h-3 w-3" />
                         Back to Sign In
                       </button>
                     </div>
                   </form>
                 </div>
               ) : showResetPassword ? (
                 <div className="space-y-4">
                   <div className="text-center mb-6">
                     <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle className="w-8 h-8 text-green-400" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-200 mb-2">Enter Reset Code</h3>
                     <p className="text-gray-400">
                       We've sent a reset code to <strong className="text-green-300">{email}</strong>
                     </p>
                   </div>

                   <form onSubmit={handleResetPassword} className="space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="reset-code" className="text-sm font-medium text-gray-300">
                         Reset Code
                       </Label>
                       <Input
                         id="reset-code"
                         type="text"
                         placeholder="Enter the 6-digit code"
                         value={resetCode}
                         onChange={(e) => setResetCode(e.target.value)}
                         className="h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-center text-lg font-mono"
                         maxLength={6}
                         required
                       />
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="new-password" className="text-sm font-medium text-gray-300">
                         New Password
                       </Label>
                       <div className="relative">
                         <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                         <Input
                           id="new-password"
                           type={showNewPassword ? "text" : "password"}
                           placeholder="Enter new password"
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}
                           className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                           required
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-600 text-gray-400"
                           onClick={() => setShowNewPassword(!showNewPassword)}
                         >
                           {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </Button>
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="confirm-new-password" className="text-sm font-medium text-gray-300">
                         Confirm New Password
                       </Label>
                       <div className="relative">
                         <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                         <Input
                           id="confirm-new-password"
                           type={showConfirmPassword ? "text" : "password"}
                           placeholder="Confirm new password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                           required
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-600 text-gray-400"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                         >
                           {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </Button>
                       </div>
                     </div>

                     <Button
                       type="submit"
                       disabled={isLoading}
                       className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                     >
                       {isLoading ? (
                         <div className="flex items-center">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           Resetting Password...
                         </div>
                       ) : (
                         <div className="flex items-center">
                           <CheckCircle className="mr-2 h-4 w-4" />
                           Reset Password
                         </div>
                       )}
                     </Button>

                     <div className="text-center">
                       <button
                         type="button"
                         onClick={() => {
                           setShowResetPassword(false);
                           setShowForgotPassword(true);
                           setResetCode("");
                           setNewPassword("");
                           setConfirmPassword("");
                         }}
                         className="text-sm text-gray-400 hover:text-gray-300 hover:underline transition-colors duration-300"
                       >
                         <ArrowLeft className="inline mr-1 h-3 w-3" />
                         Back to Email Entry
                       </button>
                     </div>
                   </form>
                 </div>
               ) : (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-2">Verify Your Email</h3>
                    <p className="text-gray-400">
                      We've sent a confirmation code to <strong className="text-green-300">{email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleConfirmRegistration} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="confirmation-code" className="text-sm font-medium text-gray-300">
                        Confirmation Code
                      </Label>
                      <Input
                        id="confirmation-code"
                        type="text"
                        placeholder="Enter the 6-digit code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        className="h-12 rounded-xl border-2 border-gray-600 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-center text-lg font-mono"
                        maxLength={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="w-full h-12 border-2 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                    >
                      Resend Code
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
