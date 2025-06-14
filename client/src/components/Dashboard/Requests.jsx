import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import RatingModal from './RatingModal';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { FaInbox, FaPaperPlane, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';

const Requests = () => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const [inRes, outRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}requests/incoming`, { headers }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}requests/outgoing`, { headers }),
      ]);
      setIncoming(inRes.data.data);
      setOutgoing(outRes.data.data);
    } catch (err) {
      toast.error("Failed to load requests", { id: "fetch-error" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, status) => {
    const headers = { Authorization: `Bearer ${user.token}` };
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}requests/${requestId}`,
        { status },
        { headers }
      );
      toast.success(`Request ${status}`, {
        id: `status-${requestId}`,
        style: { background: "#22C55E", color: "#fff" },
      });

      if (status === "Accepted") {
        try {
          const convRes = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}conversations`,
            { requestId },
            { headers }
          );
          toast.success("Chat started! Check your inbox.", { id: `chat-${requestId}` });
        } catch (err) {
          if (err.response?.status === 409) {
            const otherUser = err.response.data?.otherUser;
            const displayName = otherUser?.name || otherUser?.email || "this user";
            toast(`💬 Chat already exists with ${displayName}`, {
              id: `exists-${requestId}`,
              style: { background: "#FFD54F", color: "#333333" },
            });
          } else {
            toast.error("Error while starting chat", { id: `conv-error-${requestId}` });
          }
        }
      }

      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update request", {
        id: `update-fail-${requestId}`,
        style: { background: "#EF4444", color: "#fff" },
      });
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}ratings`, reviewData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedRequest(null);
      toast.success("Thanks for your review!", {
        id: `review-success-${reviewData.itemId}`,
        style: { background: "#22C55E", color: "#fff" },
      });
      fetchRequests();
    } catch {
      toast.error("Failed to submit review", {
        id: `review-fail-${reviewData.itemId}`,
        style: { background: "#EF4444", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="mt-6 space-y-10">
      {/* Incoming Requests */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold text-[#2A6FDB] flex items-center gap-2 mb-4">
          <FaInbox className="text-[#FFD54F]" /> Incoming Requests
        </h2>
        {loading ? (
          <div className="flex justify-center text-[#6B7280]">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        ) : incoming.length === 0 ? (
          <p className="text-[#6B7280]">No incoming requests at the moment.</p>
        ) : (
          incoming.map((req) => (
            <div key={req._id} className="border-b py-4">
              <p className="text-[#333333]">
                📦 <strong>Item:</strong> {req.item.title}
              </p>
              <p className="text-[#6B7280] text-sm">
                📧 <strong>From:</strong> {req.requester.email}
              </p>
              <p className="text-[#6B7280] text-sm">
                📌 <strong>Status:</strong> {req.status}
              </p>
              {req.status === "Pending" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => updateStatus(req._id, "Accepted")}
                    className="bg-[#3ECF8E] hover:bg-[#35b27c] text-white font-semibold px-4 py-1.5 rounded flex items-center gap-1"
                  >
                    <FaCheckCircle /> Accept
                  </button>
                  <button
                    onClick={() => updateStatus(req._id, "Rejected")}
                    className="bg-[#EF4444] hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded flex items-center gap-1"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Outgoing Requests */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold text-[#2A6FDB] flex items-center gap-2 mb-4">
          <FaPaperPlane className="text-[#FFD54F]" /> Your Sent Requests
        </h2>
        {loading ? (
          <div className="flex justify-center text-[#6B7280]">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        ) : outgoing.length === 0 ? (
          <p className="text-[#6B7280]">You haven’t sent any requests yet.</p>
        ) : (
          outgoing.map((req) => (
            <div key={req._id} className="border-b py-4">
              <p className="text-[#333333]">
                📦 <strong>Item:</strong> {req.item.title}
              </p>
              <p className="text-[#6B7280] text-sm">
                🧑‍🏫 <strong>To:</strong> {req.item.user?.email || "Unknown"}
              </p>
              <p className="text-[#6B7280] text-sm">
                📌 <strong>Status:</strong> {req.status}
              </p>

              {req.status === "Accepted" && !req.rated && (
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="mt-3 bg-[#FFD54F] hover:bg-yellow-400 text-[#333333] font-semibold px-4 py-1.5 rounded flex items-center gap-1"
                >
                  <FaStar /> Leave a Review
                </button>
              )}

              {req.status === "Accepted" && req.rated && (
                <p className="text-[#22C55E] text-sm mt-2 flex items-center gap-1">
                  <FaCheckCircle /> Review Submitted
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {selectedRequest && (
        <RatingModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSubmit={handleReviewSubmit}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default Requests;