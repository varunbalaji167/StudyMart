import { useState, useEffect } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../Navbar";
import Requests from "./Requests";
import Footer from "../Footer";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    toast.dismiss();
    toast("Welcome back to Study Mart!", {
      id: "welcome-toast",
      icon: "🎓",
      style: {
        background: "#2A6FDB",
        color: "#fff",
      },
    });
  }, []);

  return (
    <div className="bg-[#F3F6FA] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto mt-6 p-4">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <FaUserGraduate className="text-[#2A6FDB]" size={28} />
            <h1 className="text-3xl font-bold text-[#333333]">Welcome to Study Mart</h1>
          </div>
          <p className="mt-2 text-[#6B7280] text-sm">
            Your academic exchange hub — request, lend, and connect with peers at University of Roehampton.
          </p>
        </div>

        <section className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="animate-spin text-[#2A6FDB]" size={40} />
            </div>
          ) : (
            <Requests />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;