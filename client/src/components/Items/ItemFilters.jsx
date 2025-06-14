import React from 'react';
import {
  FaSearch,
  FaUniversity,
  FaBook,
  FaTags,
} from 'react-icons/fa';
import { LoaderCircle } from 'lucide-react';

const ItemFilters = ({ onFilterChange, loading }) => {
  const handleChange = (e) => {
    onFilterChange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-[#F3F6FA] rounded-xl shadow-md px-4 py-6 sm:px-6 md:px-8 flex flex-wrap gap-4 justify-between items-center max-w-5xl mx-auto mb-6">
      
      {/* Search */}
      <div className="relative w-full sm:w-[48%] md:w-[23%]">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
        <input
          name="search"
          placeholder="Search title..."
          onChange={handleChange}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] text-[#333333] bg-white placeholder-[#6B7280]"
        />
      </div>

      {/* Course Code */}
      <div className="relative w-full sm:w-[48%] md:w-[23%]">
        <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
        <input
          name="courseCode"
          placeholder="Course Code"
          onChange={handleChange}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] text-[#333333] bg-white placeholder-[#6B7280]"
        />
      </div>

      {/* Department */}
      <div className="relative w-full sm:w-[48%] md:w-[23%]">
        <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
        <input
          name="department"
          placeholder="Department"
          onChange={handleChange}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] text-[#333333] bg-white placeholder-[#6B7280]"
        />
      </div>

      {/* Category */}
      <div className="relative w-full sm:w-[48%] md:w-[23%]">
        <FaTags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
        <select
          name="category"
          onChange={handleChange}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2A6FDB] text-[#333333]"
        >
          <option value="">All Categories</option>
          <option value="Textbooks">Textbooks</option>
          <option value="Labkits">Lab Kits</option>
          <option value="Stationery">Stationery</option>
        </select>
      </div>

      {/* Optional Loading Spinner */}
      {loading && (
        <div className="w-full flex justify-center mt-4">
          <LoaderCircle className="h-6 w-6 text-[#2A6FDB] animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ItemFilters;