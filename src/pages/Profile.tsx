import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Save,
  X,
  Shield,
  LogOut,
  ArrowLeft,
  Camera,
  Upload,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThreeDCube from "@/components/ThreeDCube";
import AddressInput from "@/components/AddressInput";
import { useToast } from "@/components/ui/use-toast";
import { getUsageSummary, getCurrentPlan } from "@/utils/usageUtils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingParticlesBackground from "@/components/ParticlesBackground";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showUserId, setShowUserId] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    location: "",
    joinDate: "",
    bio: "",
    userId: user?.userId || ""
  });

  // Update email and userId when user changes
  React.useEffect(() => {
    if (user?.email && profileData.email !== user.email) {
      setProfileData(prev => ({
        ...prev,
        email: user.email
      }));
    }
    if (user?.userId && profileData.userId !== user.userId) {
      setProfileData(prev => ({
        ...prev,
        userId: user.userId
      }));
    }
  }, [user?.email, user?.userId, profileData.email, profileData.userId]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [usageSummary, setUsageSummary] = useState(null);
  const [userPlan, setUserPlan] = useState('free');

  // Load profile data from API on component mount
  React.useEffect(() => {
    const loadProfile = async () => {
      if (user?.userId) {
        try {
          const res = await fetch(`/api/profile/get/${user.userId}`);
          const profile = await res.json();
          if (profile && Object.keys(profile).length > 0) {
            const joinDate = profile.joinDate || new Date().toLocaleDateString();
            setProfileData({
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              email: user.email || profile.email || "",
              phone: profile.phone || "",
              location: profile.location || "",
              joinDate,
              bio: profile.bio || "",
              userId: user.userId || ""
            });
            if (profile.photoUrl) {
              setPhotoUrl(profile.photoUrl);
            }
            // If joinDate was not present, save it
            if (!profile.joinDate) {
              await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.userId,
                  joinDate
                })
              });
            }
          } else {
            // Set default data with user's email
            setProfileData(prev => ({
              ...prev,
              email: user?.email || "",
            }));
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          // Fallback to blank profile
          setProfileData(prev => ({
            firstName: "",
            lastName: "",
            email: user?.email || "",
            phone: "",
            location: "",
            joinDate: "",
            bio: "",
            userId: user?.userId || ""
          }));
        }
      }
    };

    loadProfile();

    // Load plan and usage summary
    const loadPlanAndUsage = async () => {
      if (user?.userId) {
        try {
          const plan = await getCurrentPlan(user.userId);
          setUserPlan(plan);
          const summary = await getUsageSummary(user.userId);
          setUsageSummary(summary);
        } catch (error) {
          console.error('Error loading plan:', error);
          setUserPlan('free');
          // Fallback to blank usage
          setUsageSummary({
            plan: 'free',
            limits: { pdfUploads: 0, pdfCompress: 0, pdfReorder: 0, photoToPdf: 0, dailyReset: true },
            usage: { pdfUploads: 0, pdfCompress: 0, pdfReorder: 0, photoToPdf: 0, lastReset: new Date().toISOString() },
            remaining: { pdfUploads: 0, pdfCompress: 0, pdfReorder: 0, photoToPdf: 0 }
          });
        }
      }
    };

    loadPlanAndUsage();
  }, [user]);

  // Redirect if not authenticated (only after loading is complete)
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path for redirect after login
      sessionStorage.setItem('intendedPath', window.location.pathname);
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Navigation onMenuClick={() => {}} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if not authenticated (after loading is complete)
  if (!isAuthenticated) {
    return null;
  }

  const handleSave = async () => {
    if (!user?.userId) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...profileData,
        email: user?.email || profileData.email,
        photoUrl,
      };

      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, ...dataToSave })
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.userId) {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("userId", user.userId);

      try {
        const response = await fetch("/api/profile/upload-photo", {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          setPhotoUrl(data.photoUrl);
          // Dispatch event to update navigation
          window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { detail: data.photoUrl }));
          toast({
            title: "Photo uploaded",
            description: "Your profile photo has been uploaded successfully.",
          });
        } else {
          toast({
            title: "Upload failed",
            description: data.error || "Failed to upload photo.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your photo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const removeProfileImage = async () => {
    setPhotoUrl(null);

    if (user?.userId) {
      try {
        // To remove, we can update with empty photoUrl or use UpdateCommand to remove attribute
        // For simplicity, set to null
        await fetch("/api/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId, photoUrl: null })
        });
      } catch (error) {
        console.error('Error removing profile image:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <FloatingParticlesBackground />
      <ThreeDCube />
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow p-4 md:p-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">
          {/* Back to Home Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-blue-600 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="grid gap-6 md:grid-cols-3">
                         {/* Profile Header Card */}
             <Card className="md:col-span-3 shadow-2xl border-0 bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 ease-out glow-border">
               <CardContent className="p-8 text-center relative">
                 {/* Subtle background pattern */}
                 <div className="absolute inset-0 opacity-5">
                   <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full blur-2xl"></div>
                 </div>

                 <div className="relative z-10">
                   <div className="relative w-28 h-28 mx-auto mb-6 group">
                     <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-600/50 shadow-2xl hover:scale-110 transition-all duration-500 ease-out ring-4 ring-gray-700/30 hover:ring-blue-500/30">
                       {photoUrl ? (
                         <img
                           src={photoUrl}
                           alt="Profile"
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                           <User className="w-10 h-10 text-gray-300" />
                         </div>
                       )}
                     </div>

                     {/* Loading overlay */}
                     {uploadingPhoto && (
                       <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                         <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                       </div>
                     )}

                     {/* Image upload overlay - Hidden by default, shown on hover */}
                     <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                       <label htmlFor="profile-image-upload" className={`cursor-pointer ${uploadingPhoto ? 'pointer-events-none opacity-50' : ''}`}>
                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 transform group-hover:translate-y-0 translate-y-2">
                           <Camera className="w-5 h-5 text-white" />
                         </div>
                       </label>
                       <input
                         id="profile-image-upload"
                         type="file"
                         accept="image/*"
                         onChange={handleImageUpload}
                         disabled={uploadingPhoto}
                         className="hidden"
                       />
                     </div>

                     {/* Remove image button - Hidden by default, shown on hover */}
                     {photoUrl && (
                       <button
                         onClick={removeProfileImage}
                         className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 ease-out"
                       >
                         <X className="w-4 h-4 text-white" />
                       </button>
                     )}
                   </div>

                   <CardTitle className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                     Profile
                   </CardTitle>
                   <CardDescription className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                     Manage your account information and preferences with style
                   </CardDescription>
                 </div>
               </CardContent>
             </Card>

            {/* Profile Information */}
            <Card className="md:col-span-2 shadow-xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out glow-border">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">Personal Information</CardTitle>
                    <CardDescription className="text-gray-300">
                      Update your profile details and contact information
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl hover:scale-105 transition-all duration-300"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl hover:scale-105 transition-all duration-300"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400 rounded-xl hover:scale-105 transition-all duration-300"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-300 flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-400" />
                      First Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="h-12 rounded-xl border-2 border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-700 rounded-xl flex items-center text-gray-200 font-medium border border-gray-600">
                        {profileData.firstName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-300 flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-400" />
                      Last Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="h-12 rounded-xl border-2 border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-700 rounded-xl flex items-center text-gray-200 font-medium border border-gray-600">
                        {profileData.lastName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="userId" className="text-sm font-medium text-gray-300 flex items-center">
                        <Key className="mr-2 h-4 w-4 text-gray-400" />
                        User ID
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUserId(!showUserId)}
                        className="text-gray-400 hover:text-gray-200 hover:bg-gray-700 px-3 py-1 h-auto text-xs flex items-center space-x-1"
                      >
                        {showUserId ? (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span>Hide ID</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>Show ID</span>
                          </>
                        )}
                      </Button>
                    </div>
                    {showUserId && (
                      <div className="h-12 px-4 bg-gray-700 rounded-xl flex items-center text-gray-200 font-medium border border-gray-600 font-mono text-sm animate-in fade-in-0 duration-200">
                        {profileData.userId || "Not available"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      Email Address
                    </Label>
                    <div className="h-12 px-4 bg-gray-700 rounded-xl flex items-center text-gray-200 font-medium border border-gray-600">
                      {profileData.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-300 flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="h-12 rounded-xl border-2 border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-700 rounded-xl flex items-center text-gray-200 font-medium border border-gray-600">
                        {profileData.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-300 flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      Location
                    </Label>
                    {isEditing ? (
                      <AddressInput
                        value={profileData.location}
                        onChange={(value) => setProfileData({...profileData, location: value})}
                        placeholder="Enter your location"
                        className="h-12"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-700 rounded-xl flex items-center text-gray-200 font-medium border border-gray-600">
                        {profileData.location}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate" className="text-sm font-medium text-gray-300 flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      Member Since
                    </Label>
                    <div className="h-12 px-4 bg-gray-700 rounded-xl flex items-center text-gray-200 font-medium border border-gray-600">
                      {profileData.joinDate}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                    Bio
                  </Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 rounded-xl text-gray-200 min-h-[80px] flex items-start border border-gray-600">
                      {profileData.bio}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card className="shadow-xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out glow-border">
                <CardHeader className="bg-gradient-to-r from-green-900 to-emerald-800 p-6">
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-green-400" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Status</span>
                    <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Plan</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userPlan === 'pro+' ? 'bg-purple-900 text-purple-300' :
                      userPlan === 'pro' ? 'bg-blue-900 text-blue-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {userPlan === 'pro+' ? 'Pro+' : userPlan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Files Processed</span>
                    <span className="text-sm font-medium text-white">
                      {(usageSummary?.usage.pdfUploads || 0) + (usageSummary?.usage.pdfReorder || 0) + (usageSummary?.usage.pdfCompress || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Summary */}
              <Card className="shadow-xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out glow-border">
                <CardHeader className="bg-gradient-to-r from-orange-900 to-yellow-800 p-6">
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-orange-400" />
                    Usage Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                      <span className="text-sm text-gray-300">PDF Uploads</span>
                      <span className="text-sm font-medium text-white">
                        {(usageSummary?.usage.pdfUploads || 0)}/{(usageSummary?.limits.pdfUploads === -1 ? '∞' : usageSummary?.limits.pdfUploads || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                      <span className="text-sm text-gray-300">PDF Reorders</span>
                      <span className="text-sm font-medium text-white">
                        {(usageSummary?.usage.pdfReorder || 0)}/{(usageSummary?.limits.pdfReorder === -1 ? '∞' : usageSummary?.limits.pdfReorder || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                      <span className="text-sm text-gray-300">PDF Compression</span>
                      <span className="text-sm font-medium text-white">
                        {(usageSummary?.usage.pdfCompress || 0)}/{(usageSummary?.limits.pdfCompress === -1 ? '∞' : usageSummary?.limits.pdfCompress || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out glow-border">
                <CardHeader className="bg-gradient-to-r from-purple-900 to-pink-800 p-6">
                  <CardTitle className="text-xl font-bold text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Process New PDF
                  </Button>
                  <Button
                    onClick={() => navigate('/photo-to-image')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Convert Images
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-900/30 hover:border-red-400 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
