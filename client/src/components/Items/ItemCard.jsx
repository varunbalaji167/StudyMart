import { Link } from 'react-router-dom';
import { FaTag, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';
import { LoaderCircle } from 'lucide-react';

const ItemCard = ({ item, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#F3F6FA] rounded-2xl shadow animate-pulse">
        <LoaderCircle className="h-10 w-10 animate-spin text-[#2A6FDB]" />
      </div>
    );
  }

  return (
    <div className="group rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white border border-gray-200 flex flex-col">
      {/* Image Section */}
      {item.images?.[0]?.url ? (
        <img
          src={item.images[0].url}
          alt={item.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-48 w-full bg-[#F3F6FA] flex items-center justify-center text-[#6B7280]">
          <FaBoxOpen size={42} />
        </div>
      )}

      {/* Details */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-semibold text-xl text-[#333333] flex items-center gap-2">
            <FaTag className="text-[#FFD54F]" />
            {item.title}
          </h2>

          <p className="text-sm text-[#6B7280] mt-1 flex items-center gap-2">
            <FaCheckCircle className="text-[#3ECF8E]" />
            <span>{item.category}</span> • <span>{item.condition}</span>
          </p>
        </div>

        <div className="mt-3">
          <Link
            to={`/items/${item._id}`}
            className="inline-block text-[#1DA1F2] hover:text-[#2A6FDB] font-medium underline transition"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;