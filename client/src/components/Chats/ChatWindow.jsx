import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSocket } from "../contexts/SocketContext";
import toast from "react-hot-toast";
import { LoaderCircle, ArrowDown } from "lucide-react";
import { FaPaperPlane } from "react-icons/fa";
import { format, isToday, isYesterday } from "date-fns";

const ChatWindow = ({ conversation, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversation?._id || !currentUser?.token || !socket) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}messages/${conversation._id}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        setMessages(res.data.data);
      } catch (err) {
        toast.error("💬 Failed to load messages", { id: "load-error" });
        console.error("Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    socket.emit("joinRoom", {
      conversationId: conversation._id,
      userId: currentUser._id,
    });

    const handleReceiveMessage = (msg) => {
      if (msg.conversation === conversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.emit("leaveRoom", {
        conversationId: conversation._id,
        userId: currentUser._id,
      });
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, conversation._id, currentUser]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    setSending(true);
    try {
      const payload = {
        conversationId: conversation._id,
        text,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}messages`,
        payload,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      const newMsg = res.data.data;
      setMessages((prev) => [...prev, newMsg]);

      socket?.emit("sendMessage", {
        conversationId: conversation._id,
        message: newMsg,
      });

      toast.success("📨 Message sent", { id: "msg-sent" });
      setText("");
      scrollToBottom();
    } catch (err) {
      toast.error("❌ Failed to send", { id: "send-error" });
      console.error("Send error:", err.response?.data || err.message);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop > clientHeight + 150);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  const formatDateLabel = (isoDate) => {
    const date = new Date(isoDate);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full max-h-full bg-[#F3F6FA] relative">
      {/* Messages Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full text-[#2A6FDB]">
            <LoaderCircle className="animate-spin" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#6B7280] mt-8 text-base">
            Start the conversation ✨
          </div>
        ) : (
          Object.entries(grouped).map(([date, msgs]) => (
            <div key={date} className="space-y-2">
              <div className="text-center text-xs font-semibold text-[#6B7280] my-2">
                {formatDateLabel(date)}
              </div>

              {msgs.map((msg) => {
                const isSender =
                  msg.sender === currentUser._id || msg.sender?._id === currentUser._id;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[80%] md:max-w-[65%]">
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm relative break-words shadow ${
                          isSender
                            ? "bg-[#2A6FDB] text-white rounded-br-none"
                            : "bg-white text-[#333333] rounded-bl-none border"
                        }`}
                      >
                        {msg.text}
                        <div className="text-xs text-[#b0b6c5] mt-1 text-right">
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 bg-[#2A6FDB] hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition"
        >
          <ArrowDown size={18} />
        </button>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white flex items-center gap-2 sticky bottom-0 z-10">
        <input
          className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] bg-[#F3F6FA] text-[#333333]"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          className="bg-[#2A6FDB] hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-60"
        >
          {sending ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <FaPaperPlane size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;