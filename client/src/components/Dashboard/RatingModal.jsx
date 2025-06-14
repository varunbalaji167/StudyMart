import React, { useState } from "react";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const RatingModal = ({ isOpen, onClose, onSubmit, request }) => {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        toUserId: request.item.user._id,
        itemId: request.item._id,
        rating: stars,
        review,
      });

      toast.dismiss();
      toast.success("Review submitted successfully!", {
        id: "rating-success",
        style: { background: "#22C55E", color: "#fff" },
      });

      setStars(5);
      setReview("");
      onClose();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to submit review", {
        id: "rating-error",
        style: { background: "#EF4444", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
          <FaTimes />
        </button>

        <h3 className="text-xl font-bold text-[#2A6FDB] mb-4 flex items-center gap-2">
          <FaStar className="text-[#FFD54F]" />
          Leave a Review
        </h3>

        <div className="mb-4">
          <label className="block mb-1 text-[#333333] font-medium">Rating:</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) =>
              n <= stars ? (
                <FaStar
                  key={n}
                  className="text-[#FFD54F] cursor-pointer"
                  onClick={() => setStars(n)}
                />
              ) : (
                <FaRegStar
                  key={n}
                  className="text-[#FFD54F] cursor-pointer"
                  onClick={() => setStars(n)}
                />
              )
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[#333333] font-medium">Review:</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2A6FDB]"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-[#333333] font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-[#3ECF8E] hover:bg-[#32b67a] text-white font-semibold flex items-center gap-2"
          >
            {loading ? <Loader className="animate-spin w-4 h-4" /> : null}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;