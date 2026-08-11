import { useState, useEffect } from "react";

import {
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getCurrentUser, updateProfile, changePassword, deleteAccount } from "../services/user.service";
import ProtectedRoute from "../components/ProtectedRoute";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();

  // Profile state
  const [fullName, setFullName] = useState("");
  const [email] = useState(user?.email || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [aiResponseStyle, setAiResponseStyle] = useState("balanced");

  // Loading and message states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [preferencesMessage, setPreferencesMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data?.user || response.user;
        if (userData) {
          setFullName(userData.fullName || "");
          setEmail(userData.email || "");
          setEmailNotifications(userData.preferences?.emailNotifications ?? true);
          setAiResponseStyle(userData.preferences?.aiResponseStyle || "balanced");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  // Profile update handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);

    try {
      const response = await updateProfile({ fullName });
      const updatedUser = response.data?.user || response.user;

      if (updatedUser) {
        setFullName(updatedUser.fullName);
        updateUser(updatedUser);
        setProfileMessage({ type: "success", text: "Profile updated successfully" });
      }
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      setPasswordLoading(false);
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordMessage({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Preferences save handler
  const handlePreferencesSave = async (e) => {
    e.preventDefault();
    setPreferencesLoading(true);
    setPreferencesMessage(null);

    try {
      const response = await updateProfile({
        preferences: {
          emailNotifications,
          aiResponseStyle,
        },
      });

      const updatedUser = response.data?.user || response.user;
      if (updatedUser) {
        updateUser(updatedUser);
        setPreferencesMessage({ type: "success", text: "Preferences saved successfully" });
      }
    } catch (error) {
      setPreferencesMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save preferences",
      });
    } finally {
      setPreferencesLoading(false);
    }
  };

  // Account deletion handler
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteMessage(null);

    try {
      await deleteAccount();
      logout();
      window.location.href = "/login";
    } catch (error) {
      setDeleteMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete account",
      });
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your SciNova AI account and preferences</p>
      </div>

      <div className="settings-container">
        {/* Profile Section */}
        <div className="settings-card">
          <div className="card-header">
            <User size={20} />
            <h2>Profile</h2>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} disabled />
              <span className="field-note">Email cannot be changed</span>
            </div>
            <button type="submit" className="btn-primary" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
            {profileMessage && (
              <div className={`message ${profileMessage.type}`}>
                {profileMessage.text}
              </div>
            )}
          </form>
        </div>

        {/* Security Section */}
        <div className="settings-card">
          <div className="card-header">
            <Lock size={20} />
            <h2>Security</h2>
          </div>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPasswords ? "Hide" : "Show"} Passwords
              </button>
              <button type="submit" className="btn-primary" disabled={passwordLoading}>
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
            {passwordMessage && (
              <div className={`message ${passwordMessage.type}`}>
                {passwordMessage.text}
              </div>
            )}
          </form>
        </div>

        {/* Preferences Section */}
        <div className="settings-card">
          <div className="card-header">
            <Bell size={20} />
            <h2>Preferences</h2>
          </div>
          <form onSubmit={handlePreferencesSave}>
            <div className="form-group">
              <label>Email Notifications</label>
              <div className="toggle-container">
                <button
                  type="button"
                  className={`toggle-btn ${emailNotifications ? "active" : ""}`}
                  onClick={() => setEmailNotifications(!emailNotifications)}
                >
                  {emailNotifications ? "ON" : "OFF"}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>AI Response Style</label>
              <select
                value={aiResponseStyle}
                onChange={(e) => setAiResponseStyle(e.target.value)}
              >
                <option value="detailed">Detailed</option>
                <option value="balanced">Balanced</option>
                <option value="concise">Concise</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={preferencesLoading}>
              {preferencesLoading ? "Saving..." : "Save Preferences"}
            </button>
            {preferencesMessage && (
              <div className={`message ${preferencesMessage.type}`}>
                {preferencesMessage.text}
              </div>
            )}
          </form>
        </div>

        {/* Account Section */}
        <div className="settings-card">
          <div className="card-header">
            <SettingsIcon size={20} />
            <h2>Account</h2>
          </div>
          <div className="account-info">
            <div className="info-row">
              <span>Account Status</span>
              <span className="status-badge active">Active</span>
            </div>
            <div className="info-row">
              <span>Account Created</span>
              <span>{formatDate(user?.createdAt)}</span>
            </div>
          </div>
          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <button
              className="btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <AlertTriangle size={24} />
              <h3>Delete Account</h3>
            </div>
            <p>Are you sure you want to permanently delete your account?</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
            {deleteMessage && (
              <div className={`message ${deleteMessage.type}`}>
                {deleteMessage.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
