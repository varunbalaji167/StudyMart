
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import ChatWindow from "./ChatWindow";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { FaInbox, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Inbox = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.token || !user?.user?._id) return;

      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}conversations`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const rawConversations = res.data?.data || [];

        const processed = rawConversations.map((conv) => {
          const otherUser = conv.participants.find((p) => p._id !== user.user._id);
          return {
            ...conv,
            otherUserName: otherUser?.name || "Unknown",
          };
        });

        setConversations(processed);
      } catch (err) {
        toast.error("📭 Failed to load conversations", { id: "conv-error" });
        console.error("❌ Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] bg-[#F3F6FA]">
        {/* Sidebar */}
        <div
          className={`w-full md:w-1/3 h-full bg-white border-r transition-all duration-300 ease-in-out overflow-y-auto ${
            selectedConversation ? "hidden md:block" : "block"
          }`}
        >
          <div className="sticky top-0 z-10 bg-[#2A6FDB] text-white px-5 py-4 flex items-center justify-between shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaInbox className="text-[#FFD54F]" />
              Inbox
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 text-[#2A6FDB]">
              <LoaderCircle className="animate-spin" size={28} />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-center text-[#6B7280] mt-10">No conversations yet</p>
          ) : (
            <div className="space-y-1 px-2 py-2">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    selectedConversation?._id === conv._id
                      ? "bg-[#E8F0FE] border-l-4 border-[#2A6FDB]"
                      : "hover:bg-[#F0F4FA]"
                  }`}
                >
                  <FaUserCircle className="text-[#FFD54F] text-3xl mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1F2937]">{conv.otherUserName}</p>
                    <p className="text-sm text-[#6B7280] truncate max-w-[80%]">
                      {conv.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div
          className={`w-full md:w-2/3 bg-white h-full transition-all duration-300 ease-in-out ${
            !selectedConversation ? "hidden md:flex" : "flex flex-col"
          }`}
        >
          {selectedConversation ? (
            <>
              {/* Mobile Header */}
              <div className="md:hidden flex items-center gap-4 px-5 py-4 bg-[#2A6FDB] text-white shadow-md">
                <button onClick={handleBack}>
                  <FaArrowLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold">{selectedConversation.otherUserName}</h2>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-hidden">
                <ChatWindow
                  conversation={selectedConversation}
                  currentUser={{ ...user.user, token: user.token }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center text-[#6B7280]">
              <FaInbox size={40} className="mb-4 text-[#2A6FDB]" />
              <p className="text-xl font-medium">Select a conversation to start chatting</p>
              <p className="text-sm mt-1 text-gray-500">Your messages will appear here</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Inbox;