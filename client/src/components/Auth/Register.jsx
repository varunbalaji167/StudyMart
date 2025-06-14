import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (formData.password !== formData.confirmPassword) {
      toast.error("🚫 Passwords do not match", { id: "password-mismatch" });
      return;
    }

    try {
      const { email, password } = formData;
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}users/register`,
        { email, password }
      );
      toast.success(res.data.message || "Registration successful!", {
        id: "register-success",
      });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        id: "register-error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F6FA] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border-t-8 border-[#FFD54F]"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#2A6FDB] mb-6">
          Create Your Account
        </h2>

        <div className="mb-5 relative">
          <FaEnvelope className="absolute left-3 top-3.5 text-[#6B7280]" />
          <input
            type="email"
            name="email"
            placeholder="Email (only @uel.ac.uk)"
            value={formData.email}
            onChange={handleChange}
            required
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] text-[#333333]"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <FaLock className="absolute left-3 top-3.5 text-[#6B7280]" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] text-[#333333]"
          />
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3.5 text-[#6B7280] cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <FaLock className="absolute left-3 top-3.5 text-[#6B7280]" />
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] text-[#333333]"
          />
          <div
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-3.5 text-[#6B7280] cursor-pointer"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#2A6FDB] hover:bg-[#245dc0] text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Register
        </button>

        <p className="text-sm text-center text-[#6B7280] mt-4">
          Already have an account?{" "}
          <span
            className="text-[#1DA1F2] hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;