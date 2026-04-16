import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import TopBar from "../components/layout/TopBar";
import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  FileText,
  Trash2,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch the full profile from the backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getProfile();
        const data = res.data;
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
        });
        if (data.profile_picture_url) {
          setPreviewUrl(data.profile_picture_url);
          updateUser({ profile_picture: data.profile_picture_url });
        }
      } catch {
        // fallback to context data
        setProfile({
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          bio: user?.bio || "",
        });
        setPreviewUrl(user?.profile_picture || null);
      }
      setLoaded(true);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
      toast.error("Please select an image file (JPEG, PNG, GIF, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Instant preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setUploading(true);
    try {
      const res = await authApi.uploadProfilePicture(file);
      const newUrl = res.data.profile_picture_url;
      setPreviewUrl(newUrl);
      updateUser({ profile_picture: newUrl });
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to upload picture");
      setPreviewUrl(user?.profile_picture || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      await authApi.removeProfilePicture();
      setPreviewUrl(null);
      updateUser({ profile_picture: null });
      toast.success("Profile picture removed");
    } catch {
      toast.error("Failed to remove picture");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("first_name", profile.first_name);
      formData.append("last_name", profile.last_name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("bio", profile.bio);

      const res = await authApi.updateProfile(formData);
      updateUser({
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        email: res.data.email,
        phone: res.data.phone,
        bio: res.data.bio,
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div>
        <TopBar title="My Profile" subtitle="Manage your account" />
        <div className="p-8 flex justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="My Profile" subtitle="Manage your personal information and preferences" />

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-ambient overflow-hidden">
          {/* Cover gradient */}
          <div className="h-36 bg-gradient-to-r from-sidebar via-sidebar to-primary-dark/50 relative" />

          <div className="px-8 pb-8 -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-surface-container-low flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-primary-dark">
                      {(user?.username || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Camera overlay */}
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  disabled={uploading}
                  className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 
                             flex items-center justify-center opacity-0 group-hover:opacity-100 
                             transition-all duration-300 cursor-pointer"
                >
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-7 h-7 text-white drop-shadow-lg" />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Small camera badge */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-lg 
                               flex items-center justify-center shadow-md border-2 border-white">
                  <Camera className="w-4 h-4 text-primary-dark" />
                </div>
              </div>

              {/* User headline info */}
              <div className="flex-1 pt-4 sm:pt-0">
                <h2 className="text-headline-md text-on-surface">
                  {profile.first_name || profile.last_name
                    ? `${profile.first_name} ${profile.last_name}`.trim()
                    : user?.username}
                </h2>
                <p className="text-body-md text-on-surface-variant mt-0.5">
                  @{user?.username}
                </p>
              </div>

              {/* Role & Remove photo */}
              <div className="flex items-center gap-3">
                {previewUrl && (
                  <button
                    onClick={handleRemovePicture}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-label-sm text-error 
                             bg-error/5 hover:bg-error/10 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
                <span className="px-4 py-2 bg-primary-container/60 text-primary-dark rounded-full text-label-sm font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave}>
          <div className="bg-white rounded-2xl shadow-ambient p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-title-sm text-on-surface">Personal Information</h3>
                <p className="text-label-sm text-on-surface-variant mt-0.5">
                  Update your details below
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn-gradient px-6 py-2.5 rounded-xl text-body-md flex items-center gap-2 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-body-md font-medium text-on-surface">
                  <User className="w-4 h-4 text-on-surface-variant" /> First Name
                </label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring transition-all duration-200"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-body-md font-medium text-on-surface">
                  <User className="w-4 h-4 text-on-surface-variant" /> Last Name
                </label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-body-md font-medium text-on-surface">
                  <Mail className="w-4 h-4 text-on-surface-variant" /> Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring transition-all duration-200"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-body-md font-medium text-on-surface">
                  <Phone className="w-4 h-4 text-on-surface-variant" /> Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring transition-all duration-200"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-body-md font-medium text-on-surface">
                <FileText className="w-4 h-4 text-on-surface-variant" /> Bio
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Tell us a bit about yourself..."
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none
                         text-body-md input-focus-ring transition-all duration-200 resize-none"
              />
            </div>

            {/* Read-only info */}
            <div className="pt-6 border-t border-outline-variant/15">
              <h4 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-4">
                Account Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Username</p>
                    <p className="text-body-md text-on-surface font-medium">{user?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Role</p>
                    <p className="text-body-md text-on-surface font-medium">{user?.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Status</p>
                    <p className="text-body-md text-on-surface font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
