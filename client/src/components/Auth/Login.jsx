import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}users/login`,
        formData
      );
      login(res.data);
      toast.success("Login successful!", { id: "login-success" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        id: "login-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F6FA] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border-t-8 border-[#FFD54F]"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#2A6FDB] mb-6">
          Study Mart Login
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

        <div className="mb-6 relative">
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
            className="absolute right-3 top-3.5 text-[#6B7280] cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#2A6FDB] hover:bg-[#245dc0] text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={18} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-sm text-center text-[#6B7280] mt-4">
          Need help? Contact support@studymart.in
        </p>

        <p className="text-sm text-center text-[#6B7280] mt-2">
          Not registered yet?{" "}
          <a
            href="/register"
            className="text-[#1DA1F2] hover:underline font-medium"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
