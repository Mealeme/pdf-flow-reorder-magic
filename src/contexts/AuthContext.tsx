import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useToast } from '@/components/ui/use-toast';

interface User {
  userId: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  confirmRegistration: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  initiatePasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthState();

    // Listen for authentication events across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'amplify-auth-config' || e.key?.startsWith('CognitoIdentityServiceProvider')) {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check auth state when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser({
        userId: currentUser.userId,
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId || '',
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      
      if (isSignedIn) {
        await checkAuthState();
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        toast({
          title: "Account not confirmed",
          description: "Please check your email and confirm your account.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      if (isSignUpComplete) {
        toast({
          title: "Registration successful",
          description: "Please check your email to confirm your account.",
        });
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        toast({
          title: "Confirmation required",
          description: "Please check your email and enter the confirmation code.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRegistration = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      const { isSignUpComplete, userId } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        // Create free plan and default profile for new user
        try {
          console.log('🚀 Creating user data for new user:', userId, 'email:', email);

          // Create free subscription
          const subscriptionResponse = await fetch("/api/subscription/free", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
          });

          if (!subscriptionResponse.ok) {
            console.error('Failed to create free subscription');
          } else {
            console.log('✅ Free subscription created successfully');
          }

          // Create default profile - this will be handled automatically by getUserProfile now
          // But we'll still call update to ensure it has the correct email
          const profileResponse = await fetch("/api/profile/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              firstName: "",
              lastName: "",
              email,
              phone: "",
              location: "",
              joinDate: new Date().toLocaleDateString(),
              bio: "PDF enthusiast and document management specialist. Love working with NewMicro tools!"
            })
          });

          if (!profileResponse.ok) {
            console.error('Failed to create/update user profile');
          } else {
            console.log('✅ User profile created/updated successfully');
          }

          console.log('🎉 User account setup completed successfully');
        } catch (error) {
          console.error('❌ Error creating user data:', error);
          // Don't block account confirmation if data creation fails
        }

        toast({
          title: "Account confirmed",
          description: "Your account has been successfully confirmed. You can now sign in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Confirmation failed",
        description: error.message || "An error occurred during confirmation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationCode = async (email: string) => {
    try {
      setIsLoading(true);
      await resendSignUpCode({ username: email });
      toast({
        title: "Code resent",
        description: "A new confirmation code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend code",
        description: error.message || "An error occurred while resending the code",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      await resetPassword({ username: email });
      toast({
        title: "Password reset initiated",
        description: "A password reset code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while initiating password reset",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      toast({
        title: "Password reset successful",
        description: "Your password has been successfully reset. You can now sign in with your new password.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while resetting your password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    confirmRegistration,
    resendConfirmationCode,
    initiatePasswordReset,
    confirmPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
