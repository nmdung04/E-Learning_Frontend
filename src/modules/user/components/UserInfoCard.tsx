import { useEffect, useRef, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '@/services/auth/useAuth';

type ProfileFormData = {
  username: string;
  email: string;
  phoneNumber: string;
  location: string;
  goal: string;
  goalProgress: number;
};

const INITIAL_PROFILE: ProfileFormData = {
  username: 'John Doe',
  email: 'john.doe@email.com',
  phoneNumber: '+84 123 456 789',
  location: 'Vietnam',
  goal: 'Achieve fluent English communication in 6 months',
  goalProgress: 65,
};

const getInitials = (username: string) => {
  if (!username) return 'U';
  const parts = username.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

export const UserInfoCard = () => {
  const { user, updateAvatar, updateProfile } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const [profile, setProfile] = useState<ProfileFormData>(INITIAL_PROFILE);
  const [draft, setDraft] = useState<ProfileFormData>(INITIAL_PROFILE);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  useEffect(() => {
    if (!user) return;
    const id = window.requestAnimationFrame(() => {
      setProfile((prev) => ({
        ...prev,
        username: user.username ?? prev.username,
        email: user.email ?? prev.email,
        phoneNumber: user.phoneNumber ?? prev.phoneNumber,
        location: user.location ?? prev.location,
      }));
    });
    return () => window.cancelAnimationFrame(id);
  }, [user]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, or WEBP).");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await updateAvatar(file);
      console.log("Avatar updated successfully");
    } catch (error) {
      console.error("Failed to upload avatar", error);
      alert("Không thể tải lên ảnh đại diện. Vui lòng thử lại.");
      setAvatarPreview(null);
    } finally {
      e.target.value = "";
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setDraft((prev) => {
      if (name === 'goalProgress') {
        const next = Number(value);
        return { ...prev, goalProgress: Number.isFinite(next) ? next : 0 };
      }
      return { ...prev, [name]: value } as ProfileFormData;
    });
  };

  const validateDraft = (data: ProfileFormData) => {
    const nextErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!data.username.trim()) nextErrors.username = 'Username is required.';

    const email = data.email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email) nextErrors.email = 'Email is required.';
    else if (!emailOk) nextErrors.email = 'Email format is invalid.';

    const phone = data.phoneNumber.trim().replace(/[\s()-]/g, '');
    const phoneOk = /^\+?\d{8,15}$/.test(phone);
    if (!data.phoneNumber.trim()) nextErrors.phoneNumber = 'Phone number is required.';
    else if (!phoneOk) nextErrors.phoneNumber = 'Phone number format is invalid.';

    return nextErrors;
  };

  const handleOpenEdit = () => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setDraft(profile);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const username = draft.username.trim();
    const phoneNumber = draft.phoneNumber.trim();

    try {
      await updateProfile({
        username,
        phone_number: phoneNumber,
      });

      setProfile({
        ...draft,
        username,
        email: draft.email.trim(),
        phoneNumber,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Không thể cập nhật thông tin tài khoản. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (!isEditModalOpen) return;

    const t = window.setTimeout(() => usernameInputRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
        return;
      }

      if (event.key !== 'Tab') return;

      const root = modalRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isEditModalOpen]);

  useEffect(() => {
    if (isEditModalOpen) return;
    previouslyFocusedRef.current?.focus?.();
  }, [isEditModalOpen]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-8 border border-white-90">
        {/* Edit Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-2 px-4 py-2 bg-mint-50 text-white rounded-lg hover:bg-mint-70 transition-colors font-semibold"
          >
            <MdEdit size={18} />
            Edit Profile
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative mb-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-mint-50"
                />
              ) : user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-mint-50"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-br from-mint-50 to-mint-70 flex items-center justify-center text-white font-bold text-3xl">
                  {getInitials(profile.username)}
                </div>
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="px-3 py-2 text-sm bg-white-95 text-gray-15 rounded-lg hover:bg-white-90 transition-colors font-semibold border border-white-90"
            >
              Change Image
            </button>
            <input
              id="avatar-upload"
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              aria-label="Upload avatar image"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-15 mb-1">{profile.username}</h2>
              <p className="text-gray-40">{profile.email}</p>
              <p className="text-gray-40">{profile.phoneNumber}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-40 mb-1">Member Since</p>
                <p className="text-lg font-semibold text-gray-15">Jan 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-40 mb-1">Total Days</p>
                <p className="text-lg font-semibold text-gray-15">45 days</p>
              </div>
              <div>
                <p className="text-sm text-gray-40 mb-1">Location</p>
                <p className="text-lg font-semibold text-gray-15">{profile.location}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white-90">
              <p className="text-gray-40 mb-3">
                <span className="font-semibold text-gray-15">Learning Goal:</span> {profile.goal}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white-95 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-mint-50 transition-all duration-500"
                    style={{ width: `${profile.goalProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-mint-50">{profile.goalProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 id="edit-profile-title" className="text-2xl font-bold text-gray-15">
                Edit Profile
              </h3>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-white-95 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-15 mb-2">Username</label>
                <input
                  ref={usernameInputRef}
                  type="text"
                  name="username"
                  value={draft.username}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  className={`w-full text-gray-15 px-4 py-2 border rounded-lg focus:outline-none focus:border-mint-50 focus:ring-1 focus:ring-mint-50 transition-colors ${
                    errors.username ? 'border-red-500' : 'border-white-90'
                  }`}
                />
                {errors.username && (
                  <p id="username-error" className="mt-2 text-sm text-red-600">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-15 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={draft.email}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full text-gray-15 px-4 py-2 border rounded-lg focus:outline-none focus:border-mint-50 focus:ring-1 focus:ring-mint-50 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-white-90'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-15 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={draft.phoneNumber}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.phoneNumber)}
                  aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
                  className={`w-full text-gray-15 px-4 py-2 border rounded-lg focus:outline-none focus:border-mint-50 focus:ring-1 focus:ring-mint-50 transition-colors ${
                    errors.phoneNumber ? 'border-red-500' : 'border-white-90'
                  }`}
                />
                {errors.phoneNumber && (
                  <p id="phone-error" className="mt-2 text-sm text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-white-90">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-white-90 text-gray-15 rounded-lg hover:bg-white-95 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-mint-50 text-white rounded-lg hover:bg-mint-70 transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
