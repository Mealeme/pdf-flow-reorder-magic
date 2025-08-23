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
  Upload
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    bio: "PDF enthusiast and document management specialist. Love working with NewMicro tools!"
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from localStorage on component mount
  React.useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSave = () => {
    // Here you would typically save to backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        // Store in localStorage for persistence
        localStorage.setItem('profileImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow p-4 md:p-8">
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
             <Card className="md:col-span-3 shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 ease-out">
               <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
                 <div className="relative w-24 h-24 mx-auto mb-4">
                   {profileImage ? (
                     <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg hover:scale-110 transition-transform duration-300">
                       <img 
                         src={profileImage} 
                         alt="Profile" 
                         className="w-full h-full object-cover"
                       />
                     </div>
                   ) : (
                     <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                       <User className="w-12 h-12" />
                     </div>
                   )}
                   
                   {/* Image upload overlay */}
                   <div className="absolute -bottom-2 -right-2">
                     <label htmlFor="profile-image-upload" className="cursor-pointer">
                       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 shadow-lg">
                         <Camera className="w-4 h-4 text-white" />
                       </div>
                     </label>
                     <input
                       id="profile-image-upload"
                       type="file"
                       accept="image/*"
                       onChange={handleImageUpload}
                       className="hidden"
                     />
                   </div>
                   
                   {/* Remove image button */}
                   {profileImage && (
                     <button
                       onClick={removeProfileImage}
                       className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 shadow-lg"
                     >
                       <X className="w-3 h-3 text-white" />
                     </button>
                   )}
                 </div>
                 <CardTitle className="text-3xl font-bold mb-2">Profile</CardTitle>
                 <CardDescription className="text-blue-100 text-lg">
                   Manage your account information and preferences
                 </CardDescription>
               </CardHeader>
             </Card>

            {/* Profile Information */}
            <Card className="md:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Personal Information</CardTitle>
                    <CardDescription className="text-gray-600">
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
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl hover:scale-105 transition-all duration-300"
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
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      First Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-50 rounded-xl flex items-center text-gray-700 font-medium">
                        {profileData.firstName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Last Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-50 rounded-xl flex items-center text-gray-700 font-medium">
                        {profileData.lastName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Address
                    </Label>
                    <div className="h-12 px-4 bg-gray-50 rounded-xl flex items-center text-gray-700 font-medium">
                      {profileData.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-50 rounded-xl flex items-center text-gray-700 font-medium">
                        {profileData.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-12 px-4 bg-gray-50 rounded-xl flex items-center text-gray-700 font-medium">
                        {profileData.location}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate" className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Member Since
                    </Label>
                    <div className="h-12 px-4 bg-gray-50 rounded-xl flex items-center text-gray-700 font-medium">
                      {profileData.joinDate}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 min-h-[80px] flex items-start">
                      {profileData.bio}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-green-600" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Free
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Files Processed</span>
                    <span className="text-sm font-medium text-gray-800">24</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                  <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
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
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl hover:scale-105 transition-all duration-300"
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
