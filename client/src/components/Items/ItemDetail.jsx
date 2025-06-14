import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ItemActions from './ItemActions';
import Navbar from "../Navbar";
import { LoaderCircle } from 'lucide-react';
import {
  FaBoxOpen,
  FaInfoCircle,
  FaClipboardCheck,
  FaBook,
  FaUserCircle,
  FaEnvelope,
  FaGraduationCap,
  FaIdBadge
} from 'react-icons/fa';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}items/${id}`)
      .then(({ data }) => {
        console.log("Item Detail Response:", data);
        setItem(data.data);
      });
  }, [id]);

  if (!item) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F3F6FA]">
        <LoaderCircle className="h-10 w-10 text-[#2A6FDB] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg mt-6 mb-12">
        
        {/* Image Section */}
        {item.images?.[0]?.url ? (
          <img
            src={item.images[0].url}
            className="w-full max-h-96 object-contain rounded-xl border border-gray-200"
            alt={item.title}
          />
        ) : (
          <div className="w-full h-64 bg-[#F3F6FA] flex items-center justify-center rounded-xl text-[#6B7280]">
            <FaBoxOpen size={50} />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold mt-6 flex items-center gap-2 text-[#333333]">
          <FaInfoCircle className="text-[#2A6FDB]" />
          {item.title}
        </h1>

        {/* Description */}
        <p className="mt-2 text-base text-[#6B7280] leading-relaxed">
          {item.description}
        </p>

        {/* Condition */}
        <p className="mt-4 text-sm text-[#6B7280] flex items-center gap-2">
          <FaClipboardCheck className="text-[#3ECF8E]" />
          Condition: <span className="text-[#333333] font-medium">{item.condition}</span>
        </p>

        {/* Course Code */}
        <p className="mt-1 text-sm text-[#6B7280] flex items-center gap-2">
          <FaBook className="text-[#FFD54F]" />
          Course Code: <span className="text-[#333333] font-medium">{item.courseCode}</span>
        </p>

        {/* Owner Section */}
        {item.user && (
          <div className="mt-6 bg-[#F3F6FA] p-4 sm:p-6 rounded-lg shadow-inner border border-gray-100">
            <h3 className="font-semibold text-lg text-[#333333] mb-3 flex items-center gap-2">
              <FaUserCircle className="text-[#FFD54F]" />
              Owner Information
            </h3>

            <div className="space-y-1 text-sm text-[#6B7280]">
              <p className="flex items-center gap-2">
                <FaUserCircle className="text-[#1DA1F2]" />
                <span className="font-medium text-[#333333]">Name:</span> {item.user.name || 'Anonymous'}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-[#3ECF8E]" />
                <span className="font-medium text-[#333333]">Email:</span> {item.user.email}
              </p>
              <p className="flex items-center gap-2">
                <FaIdBadge className="text-[#2A6FDB]" />
                <span className="font-medium text-[#333333]">Roll No:</span> {item.user.rollNo}
              </p>
              <p className="flex items-center gap-2">
                <FaGraduationCap className="text-[#8B5CF6]" />
                <span className="font-medium text-[#333333]">Degree:</span> {item.user.degree} in {item.user.major}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8">
          <ItemActions itemId={id} ownerId={item.user?._id} />
        </div>
      </div>
    </>
  );
};

export default ItemDetail;