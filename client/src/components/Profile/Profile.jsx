import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  FaUser,
  FaIdBadge,
  FaGraduationCap,
  FaBook,
  FaQuoteLeft,
  FaImage,
  FaEdit,
  FaPlusCircle,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    degree: "",
    bio: "",
    major: "",
    avatar: "",
    averageRating: 0,
    sustainabilityScore: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}users/me`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.data) {
        const ratings = res.data.ratingsReceived || [];
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        setFormData({
          name: res.data.name || "",
          rollNo: res.data.rollNo || "",
          degree: res.data.degree || "",
          bio: res.data.bio || "",
          major: res.data.major || "",
          avatar: res.data.avatar || "",
          averageRating: parseFloat(averageRating.toFixed(1)),
          sustainabilityScore: res.data.sustainabilityScore || 0,
        });

        setProfileExists(Boolean(res.data.name || res.data.rollNo));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("⚠️ Failed to load profile.", { id: "fetch-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchProfile();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_BASE_URL}users/me`;

    try {
      await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success("✅ Profile updated successfully", { id: "update-success" });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("❌ Failed to update profile", { id: "update-error" });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-[#2A6FDB]" size={40} />
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="bg-[#F3F6FA] min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-6 text-[#2A6FDB] flex items-center gap-3">
            <FaUser className="text-[#FFD54F]" /> My Profile
          </h2>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { icon: <FaUser />, label: "Full Name", name: "name" },
                { icon: <FaIdBadge />, label: "Roll No / Student ID", name: "rollNo" },
                { icon: <FaGraduationCap />, label: "Degree", name: "degree" },
                { icon: <FaBook />, label: "Major", name: "major" },
                { icon: <FaQuoteLeft />, label: "Bio", name: "bio", textarea: true },
                { icon: <FaImage />, label: "Avatar URL (optional)", name: "avatar" },
              ].map(({ icon, label, name, textarea }) => (
                <div key={name}>
                  <label className="flex items-center gap-2 mb-1 font-semibold text-[#333]">
                    <span className="text-[#FFD54F]">{icon}</span> {label}
                  </label>
                  {textarea ? (
                    <textarea
                      name={name}
                      placeholder={label}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] bg-[#F3F6FA]"
                      rows={4}
                    />
                  ) : (
                    <input
                      type="text"
                      name={name}
                      placeholder={label}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] bg-[#F3F6FA]"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#3ECF8E] text-white py-3 rounded-md hover:bg-emerald-600 transition"
              >
                <FaEdit />
                Save Profile
              </button>
            </form>
          ) : profileExists ? (
            <div className="space-y-4 text-[#333]">
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full mx-auto border-4 border-[#2A6FDB] object-cover mb-4"
                />
              )}
              <p className="text-lg font-semibold flex items-center gap-2">
                <FaUser className="text-[#FFD54F]" /> {formData.name}
              </p>
              <p className="flex items-center gap-2 text-[#6B7280]">
                <FaIdBadge className="text-[#FFD54F]" /> Roll No: {formData.rollNo}
              </p>
              <p className="flex items-center gap-2 text-[#6B7280]">
                <FaGraduationCap className="text-[#FFD54F]" /> Degree: {formData.degree}
              </p>
              <p className="flex items-center gap-2 text-[#6B7280]">
                <FaBook className="text-[#FFD54F]" /> Major: {formData.major}
              </p>
              <p className="flex items-center gap-2 text-[#6B7280]">
                <FaQuoteLeft className="text-[#FFD54F]" /> Bio: {formData.bio}
              </p>
              <p className="flex items-center gap-2 text-[#FFD54F] font-semibold">
                ⭐ Average Rating: {formData.averageRating?.toFixed(1) || "N/A"} / 5
              </p>
              <p className="flex items-center gap-2 text-[#3ECF8E] font-semibold">
                🌱 Eco Level: {formData.sustainabilityScore ?? "N/A"}
              </p>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#2A6FDB] text-white py-3 rounded-md hover:bg-blue-700 transition"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          ) : (
            <div className="text-center text-[#6B7280]">
              <p>No profile data found.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 inline-flex items-center gap-2 bg-[#3ECF8E] text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition"
              >
                <FaPlusCircle /> Create Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Profile;