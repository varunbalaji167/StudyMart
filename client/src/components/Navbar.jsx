import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import toast from "react-hot-toast";
import {
  FaHome,
  FaUserCircle,
  FaInbox,
  FaPlusCircle,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen(!open);

  const handleLogout = () => {
    logout();
    toast.success("✅ Logged out successfully", { id: "logout-toast" });
    navigate("/login");
    setOpen(false);
  };

  const menuLinks = [
    { path: "/home", label: "Home", icon: <FaHome /> },
    { path: "/profile", label: "Profile", icon: <FaUserCircle /> },
    { path: "/inbox", label: "Inbox", icon: <FaInbox /> },
    { path: "/add", label: "Add Item", icon: <FaPlusCircle /> },
    { path: "/browse", label: "Items", icon: <FaBoxOpen /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/home"
          className="text-2xl font-bold text-[#2A6FDB] tracking-wide"
        >
          Study Mart
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-[#333] focus:outline-none"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 text-[#333]">
          {menuLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="flex items-center gap-1 hover:text-[#2A6FDB] transition"
              >
                <span className="text-[#FFD54F]">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}

          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#EF4444] text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <ul className="md:hidden px-6 pb-4 space-y-3 bg-white text-[#333] border-t border-gray-200">
          {menuLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 hover:text-[#2A6FDB] transition"
              >
                <span className="text-[#FFD54F]">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}

          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#EF4444] text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;